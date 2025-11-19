
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/CheckoutForm'; // To be created

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function PaymentPage() {
  const router = useRouter();
  const { client_secret } = router.query;
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (client_secret && typeof client_secret === 'string') {
      setClientSecret(client_secret);
    } else {
      // Redirect if client_secret is missing
      router.push('/checkout/review');
    }
  }, [client_secret, router]);

  if (!clientSecret) {
    return <div className="container mx-auto p-4 text-center">Loading payment...</div>;
  }

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
      <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>
      {clientSecret && stripePromise && (
        <Elements options={options as any} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
