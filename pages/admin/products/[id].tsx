
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getProductById } from '../../../lib/db';

interface EditProductPageProps {
  product: any; // Replace 'any' with actual product type
}

export default function EditProductPage({ product }: EditProductPageProps) {
  const router = useRouter();

  const handleEditProduct = async (productData: any) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update product.');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error; // Re-throw to be caught by ProductForm
    }
  };

  if (!product) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
        <p>The product you are trying to edit does not exist.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Edit Product: {product.title}</h1>
      <ProductForm initialData={product} onSubmit={handleEditProduct} onCancel={() => router.push('/admin/products')} />
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

  const { id } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const product = await getProductById(id); // Use the backend function
    if (!product) {
      return { notFound: true };
    }
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)), // Serialize for Next.js
      },
    };
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    return { notFound: true };
  }
};
