
interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none">
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <h1 className="text-lg font-semibold">Admin Panel</h1>
    </header>
  );
}
