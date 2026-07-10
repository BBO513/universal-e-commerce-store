
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Theme } from '../../../lib/config';

interface SettingsPageProps {
  theme: Theme;
}

export default function AdminSettingsPage({ theme }: SettingsPageProps) {
  const [formState, setFormState] = useState<Theme>(theme);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');

    if (section === 'colors' || section === 'metadata' || section === 'links') {
      setFormState((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof Theme] as Record<string, string>),
          [field]: value,
        },
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveConfig = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save settings.');
      }

      setStatusMessage('Settings saved successfully.');
    } catch (error) {
      setStatusMessage(`Error saving settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
              <p className="mt-2 text-slate-600">Manage your storefront branding and theme settings without touching JSON files.</p>
            </div>
            <button
              type="button"
              onClick={saveConfig}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save All Settings'}
            </button>
          </div>

          {statusMessage && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 mb-8">
              {statusMessage}
            </div>
          )}

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6 rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Store Branding</h2>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formState.storeName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Short Name</label>
                <input
                  type="text"
                  name="shortName"
                  value={formState.shortName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Tagline</label>
                <textarea
                  name="tagline"
                  value={formState.tagline}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Button Text</label>
                <input
                  type="text"
                  name="buttonText"
                  value={formState.buttonText}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-6 rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Hero Content</h2>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Hero Heading</label>
                <input
                  type="text"
                  name="heroHeading"
                  value={formState.heroHeading}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Hero Subheading</label>
                <textarea
                  name="heroSubheading"
                  value={formState.heroSubheading}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Primary CTA</label>
                  <input
                    type="text"
                    name="heroCtaPrimary"
                    value={formState.heroCtaPrimary}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Secondary CTA</label>
                  <input
                    type="text"
                    name="heroCtaSecondary"
                    value={formState.heroCtaSecondary}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Hero Image URL</label>
                <input
                  type="text"
                  name="heroImage"
                  value={formState.heroImage}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2 mt-6">
            <div className="space-y-6 rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Theme Colors</h2>
              {Object.entries(formState.colors).map(([key, value]) => (
                <div key={key} className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">{key}</label>
                  <input
                    type="color"
                    name={`colors.${key}`}
                    value={value}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-6 rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">SEO & Navigation Links</h2>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Meta Title</label>
                <input
                  type="text"
                  name="metadata.title"
                  value={formState.metadata.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Meta Description</label>
                <textarea
                  name="metadata.description"
                  value={formState.metadata.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Home Link</label>
                <input
                  type="text"
                  name="links.home"
                  value={formState.links.home}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Catalog Link</label>
                <input
                  type="text"
                  name="links.catalog"
                  value={formState.links.catalog}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Search Link</label>
                <input
                  type="text"
                  name="links.search"
                  value={formState.links.search}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Account Link</label>
                <input
                  type="text"
                  name="links.account"
                  value={formState.links.account}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={saveConfig}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save All Settings'}
            </button>
          </div>
        </div>
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

  try {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const themePath = path.join(process.cwd(), 'config', 'theme.json');
    const content = await fs.readFile(themePath, 'utf8');
    const theme = JSON.parse(content) as Theme;

    return {
      props: { theme },
    };
  } catch (error) {
    console.error('Error loading theme config for admin settings:', error);
    return {
      props: {
        theme: {
          storeName: '',
          shortName: '',
          tagline: '',
          heroHeading: '',
          heroSubheading: '',
          heroCtaPrimary: '',
          heroCtaSecondary: '',
          heroImage: '',
          buttonText: '',
          colors: {
            background: '#ffffff',
            surface: '#ffffff',
            card: '#f8fafc',
            text: '#111827',
            muted: '#6b7280',
            accent: '#0f4b5f',
            button: '#0f4b5f',
            buttonText: '#ffffff',
          },
          metadata: {
            title: '',
            description: '',
          },
          links: {
            home: '/',
            catalog: '/categories',
            search: '/search',
            account: '/login',
          },
        },
      },
    };
  }
};
