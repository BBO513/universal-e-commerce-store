
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        You do not have permission to view this page.
        <br />
        Please contact support if you believe this is an error.
      </p>
      <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
}
