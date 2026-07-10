
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 py-10">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm tracking-wide text-slate-400">
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">&copy; {new Date().getFullYear()} My Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
