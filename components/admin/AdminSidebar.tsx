
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({ isOpen, toggleSidebar }: AdminSidebarProps) {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Inventory', href: '/admin/inventory' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-center h-16 bg-gray-900 text-xl font-bold">
        Admin Panel
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
              router.pathname.startsWith(item.href) ? 'bg-gray-700' : ''
            }`}
            onClick={toggleSidebar} // Close sidebar on mobile after click
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
