
import Header from './Header';
import Footer from './Footer';
import PWAInstallPrompt from './PWAInstallPrompt'; // Import PWAInstallPrompt
import MobileNavBar from './MobileNavBar'; // Import MobileNavBar

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-boutique-bg text-slate-950">
      <Header />
      <main className="flex-grow section-shell">
        {children}
      </main>
      <Footer />
      <PWAInstallPrompt />
      <MobileNavBar />
    </div>
  );
}
