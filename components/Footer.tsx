
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} AutoStore. All rights reserved.</p>
      </div>
    </footer>
  );
}
