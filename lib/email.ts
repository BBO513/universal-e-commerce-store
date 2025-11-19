import nodemailer from 'nodemailer';

interface Order {
  id: number;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price_at_purchase: number;
    images?: string[]; // Added
    condition?: string; // Added
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postcode: string;
  };
  userEmail: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderConfirmationEmail(order: Order) {
  const orderItemsHtml = order.items.map(item => `
    <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
      <div style="display: flex; align-items: center;">
        ${item.images && item.images.length > 0 ? `<img src="${item.images[0]}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
        <div>
          <p style="margin: 0; font-weight: bold;">${item.title}</p>
          <p style="margin: 0; font-size: 0.9em; color: #555;">Quantity: ${item.quantity}</p>
          <p style="margin: 0; font-size: 0.9em; color: #555;">Price: $${item.price_at_purchase.toFixed(2)}</p>
          ${item.condition ? `<p style="margin: 0; font-size: 0.9em; color: #555;">Condition: ${item.condition}</p>` : ''}
        </div>
      </div>
    </li>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.userEmail,
    subject: `Order Confirmation - #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #28a745; text-align: center;">Thank you for your order!</h1>
        <p style="text-align: center; font-size: 1.1em;">Your order <strong>#${order.id}</strong> has been confirmed and will be shipped soon.</p>
        
        <h2 style="color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px;">Order Summary:</h2>
        <ul style="list-style: none; padding: 0;">
          ${orderItemsHtml}
        </ul>
        <p style="font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px;">Total: $${order.total.toFixed(2)}</p>

        <h2 style="color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px;">Shipping Address:</h2>
        <p style="margin: 0;">${order.shippingAddress.street}</p>
        <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postcode}</p>

        <p style="margin-top: 30px; font-size: 0.9em; color: #777;">If you have any questions, please contact us at ${process.env.EMAIL_FROM}.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.userEmail} for order #${order.id}`);
  } catch (error) {
    console.error(`Error sending email for order #${order.id}:`, error);
  }
}