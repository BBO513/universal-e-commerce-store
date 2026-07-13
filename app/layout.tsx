import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata = {
  title: "Universal Store",
  description: "Premium storefront experience",
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-boutique-bg text-slate-950 antialiased`}>
        <div className="min-h-screen bg-boutique-bg">
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
