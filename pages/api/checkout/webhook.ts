
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { createOrder, addOrderItems, clearCart, updateOrderStatus } from '../../../lib/db';
import { sendOrderConfirmationEmail } from '../../../lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve metadata
      const userId = session.metadata?.userId ? parseInt(session.metadata.userId, 10) : null;
      const cartItemsData = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
      const shippingAddressData = session.metadata?.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : null;
      const userEmail = session.customer_details?.email || '';

      if (!userId) {
        console.error('User ID not found in session metadata.');
        return res.status(400).send('User ID missing.');
      }

      try {
        // Calculate total from metadata (or re-calculate from cartItemsData for security)
        const total = (session.amount_total || 0) / 100; // Convert cents to dollars

        // Create order
        const newOrder = await createOrder(userId, total, 'pending', session.payment_intent as string);

        // Add order items
        const orderItems = cartItemsData.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          title: item.title,
          images: item.images, // Added
          condition: item.condition, // Added
        }));
        await addOrderItems(newOrder.id, orderItems);

        // Clear user's cart
        await clearCart(userId);

        // Update order status to 'paid'
        await updateOrderStatus(newOrder.id, 'paid');

        // Send order confirmation email
        if (userEmail && shippingAddressData) {
          await sendOrderConfirmationEmail({
            id: newOrder.id,
            total: newOrder.total,
            items: orderItems,
            shippingAddress: shippingAddressData,
            userEmail: userEmail,
          });
        }

        console.log(`Order ${newOrder.id} created and cart cleared for user ${userId}`);
      } catch (error) {
        console.error('Error processing checkout.session.completed:', error);
        return res.status(500).json({ message: 'Error processing order.' });
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}