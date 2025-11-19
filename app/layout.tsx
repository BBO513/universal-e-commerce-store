'use client';

import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar"; // Restored
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { CartProvider } from "@/context/CartContext"; // Import CartProvider
import { CurrencyProvider } from "@/context/CurrencyContext"; // Import CurrencyProvider

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <CurrencyProvider> {/* Wrap with CurrencyProvider */}
            <CartProvider>
              <Navbar /> {/* Restored */}
              <main>{children}</main>
            </CartProvider>
          </CurrencyProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
