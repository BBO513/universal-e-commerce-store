
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function NewProductPage() {
  const router = useRouter();

  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add product.');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error; // Re-throw to be caught by ProductForm
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleAddProduct} onCancel={() => router.push('/admin/products')} />
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
