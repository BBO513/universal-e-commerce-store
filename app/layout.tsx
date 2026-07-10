'use client';

import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-boutique-bg text-slate-950 antialiased`}>
        <SessionProvider>
          <CurrencyProvider>
            <CartProvider>
              <div className="min-h-screen bg-boutique-bg">
                <Navbar />
                <main className="min-h-[calc(100vh-4rem)]">
                  {children}
                </main>
              </div>
            </CartProvider>
          </CurrencyProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
