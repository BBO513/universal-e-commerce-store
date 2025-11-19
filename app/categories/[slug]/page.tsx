import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { slug } = params;

  // Placeholder data
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    imageUrl: `https://via.placeholder.com/300x300.png?text=Product+${i + 1}`,
  }));

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative w-full h-48">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                <p className="text-gray-600 mt-2">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
