
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getOrderById, updateOrderStatus } from '../../../../lib/db';
// import Stripe from 'stripe'; // Uncomment and configure Stripe in a real application

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16', // Use your Stripe API version
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  const orderId = parseInt(id, 10);

  if (req.method === 'GET') {
    try {
      const order = await getOrderById(orderId);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Order status is required' });
    }

    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      if (updatedOrder) {
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // This is for refund functionality
    const { paymentIntentId, amount } = req.body;

    if (!paymentIntentId || !amount) {
      return res.status(400).json({ message: 'Payment Intent ID and amount are required for refund' });
    }

    try {
      // Placeholder for Stripe refund logic
      // const refund = await stripe.refunds.create({
      //   payment_intent: paymentIntentId,
      //   amount: Math.round(amount * 100), // amount in cents
      // });

      // In a real app, you would also update your DB to reflect the refund
      console.log(`Mock refund for Payment Intent ${paymentIntentId} of amount ${amount}`);
      res.status(200).json({ message: 'Refund initiated (mock)', refundId: 'mock_refund_id' });
    } catch (error: any) {
      console.error('Error issuing refund:', error);
      res.status(500).json({ message: error.message || 'Failed to issue refund' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
