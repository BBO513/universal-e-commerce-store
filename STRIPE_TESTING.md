# Stripe Testing Quick Reference

## Test Card Numbers

### Successful Payments
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Payment Declines
```
Generic Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Lost Card: 4000 0000 0000 9987
Stolen Card: 4000 0000 0000 9979
```

### 3D Secure Authentication
```
Required: 4000 0025 0000 3155
Supported: 4000 0027 6000 3184
```

### International Cards
```
Brazil: 4000 0007 6000 0002
Mexico: 4000 0048 4000 0008
```

## Webhook Events to Monitor

### Critical Events
- `checkout.session.completed` - Payment successful, create order
- `payment_intent.succeeded` - Payment processed successfully
- `payment_intent.payment_failed` - Payment failed

### Additional Events
- `charge.succeeded` - Charge completed
- `charge.failed` - Charge failed
- `customer.created` - New customer created

## Local Webhook Testing

### Setup Stripe CLI
1. Download: https://stripe.com/docs/stripe-cli
2. Install and add to PATH
3. Login: `stripe login`

### Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/checkout/webhook
```

This will output a webhook secret (whsec_...) - add it to your .env.local

### Trigger Test Events
```bash
# Test successful payment
stripe trigger checkout.session.completed

# Test failed payment
stripe trigger payment_intent.payment_failed
```

## Testing Workflow

### 1. Start Local Server
```bash
npm run dev
```

### 2. Start Stripe Webhook Forwarding
```bash
stripe listen --forward-to localhost:3000/api/checkout/webhook
```

### 3. Test Payment Flow
1. Add items to cart
2. Proceed to checkout
3. Fill in address and shipping
4. Use test card: 4242 4242 4242 4242
5. Complete payment
6. Verify order created in database
7. Check webhook received in Stripe CLI output
8. Verify email sent

### 4. Test Failed Payment
1. Use decline card: 4000 0000 0000 0002
2. Verify error message displays
3. Verify order not created
4. Check webhook logs

## Production Webhook Setup

### 1. Create Webhook Endpoint
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/checkout/webhook`
4. Select events:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed

### 2. Get Webhook Secret
1. Click on your webhook endpoint
2. Click "Reveal" under "Signing secret"
3. Copy the secret (whsec_...)
4. Add to Vercel environment variables

### 3. Test Production Webhook
1. Use Stripe Dashboard to send test webhook
2. Check webhook logs in Stripe Dashboard
3. Verify your application receives and processes it

## Troubleshooting

### Webhook Not Receiving Events
- Check webhook secret is correct in .env.local
- Verify endpoint URL is accessible
- Check Stripe CLI is running (for local)
- Review webhook logs in Stripe Dashboard

### Payment Not Processing
- Verify Stripe keys are correct (test vs live)
- Check browser console for errors
- Verify Stripe Elements loaded correctly
- Check network tab for API errors

### Order Not Created After Payment
- Check webhook is receiving events
- Review server logs for errors
- Verify database connection
- Check order creation logic in webhook handler

## Useful Stripe CLI Commands

```bash
# Login to Stripe
stripe login

# List webhooks
stripe webhooks list

# View webhook events
stripe events list

# Trigger specific event
stripe trigger payment_intent.succeeded

# View logs
stripe logs tail

# Test webhook endpoint
stripe webhooks test --endpoint-id we_xxx
```

## API Endpoint Reference

### Create Payment Intent
```
POST /api/checkout/create-payment-intent
Body: { userId, cartItems }
Returns: { clientSecret, paymentIntentId }
```

### Webhook Handler
```
POST /api/checkout/webhook
Headers: stripe-signature
Body: Raw Stripe event
Returns: { received: true }
```

## Environment Variables

### Development (.env.local)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Production (Vercel)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (production webhook)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Security Best Practices

- ✓ Never expose secret keys in client code
- ✓ Always verify webhook signatures
- ✓ Use HTTPS in production
- ✓ Validate amounts server-side
- ✓ Log all payment events
- ✓ Handle errors gracefully
- ✓ Test thoroughly before going live

## Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Documentation](https://stripe.com/docs/webhooks)
- [Payment Intents API](https://stripe.com/docs/api/payment_intents)
