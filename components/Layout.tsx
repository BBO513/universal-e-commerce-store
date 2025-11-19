
import Header from './Header';
import Footer from './Footer';
import PWAInstallPrompt from './PWAInstallPrompt'; // Import PWAInstallPrompt
import MobileNavBar from './MobileNavBar'; // Import MobileNavBar

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <Footer />
      <PWAInstallPrompt /> {/* Render the PWA install prompt */}
      <MobileNavBar /> {/* Render the mobile navigation bar */}
    </div>
  );
}
