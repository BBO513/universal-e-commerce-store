import { useEffect } from 'react'; // Import useEffect
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import { CheckoutProvider } from '../context/CheckoutContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import Head from 'next/head'; // Import Head
import { registerServiceWorker } from '../lib/registerServiceWorker'; // Import service worker registration

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <SessionProvider session={session}>
      <CurrencyProvider>
        <CartProvider>
          <CheckoutProvider>
            <Layout>
              <Head>
                <link rel="manifest" href="/manifest.json" />
              </Head>
              <Component {...pageProps} />
            </Layout>
          </CheckoutProvider>
        </CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
