
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return null; // This page will redirect, so no content is needed
}
