
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLogoFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder. In a real application, you would send this data to a backend API.
    console.log('Saving settings (not functional yet):', { storeName, contactEmail, logoFile });
    alert('Settings saved (placeholder - not functional yet)!');
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Store Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Your Awesome Store"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="support@yourstore.com"
            />
          </div>

          <div>
            <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700">Store Logo (Optional)</label>
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoFile && <p className="mt-2 text-sm text-gray-500">Selected file: {logoFile.name}</p>}
            <p className="mt-2 text-sm text-gray-500">
              (Note: Logo upload is a placeholder and not functional yet. In a real app, this would upload to storage.)
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Future Settings</h2>
            <p className="text-gray-600">
              This section is a placeholder for additional settings that will be implemented in future phases,
              such as payment gateway configurations, shipping options, SEO settings, etc.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Settings (Placeholder)
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
