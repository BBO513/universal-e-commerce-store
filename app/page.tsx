import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Australian Automotive Parts Store - High Quality Auto Parts",
  description: "Find high-quality automotive parts for all makes and models in Australia. Shop for engine parts, brakes, suspension, and more with fast shipping.",
  keywords: "auto parts, automotive parts, car parts, Australia, engine parts, brakes, suspension, car accessories",
  openGraph: {
    title: "Australian Automotive Parts Store - High Quality Auto Parts",
    description: "Find high-quality automotive parts for all makes and models in Australia. Shop for engine parts, brakes, suspension, and more with fast shipping.",
    type: "website",
    url: "https://www.yourdomain.com/", // TODO: Replace with actual domain
    images: [
      {
        url: "/og-image.jpg", // Placeholder for Open Graph image
        alt: "Australian Automotive Parts Store Logo",
      },
    ],
  },
  // Add other metadata as needed
};

export default function HomePage() {
  return (
    <>
      <div className="bg-white shadow-xl rounded-lg p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to AutoStore!</h1>
        <p className="text-lg text-gray-600 mb-10">
          Find high-quality automotive parts for all makes and models in Australia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Vast Selection</h2>
            <p className="text-gray-600">Explore our extensive catalog of parts for all makes and models.</p>
            <Link href="/categories" className="mt-4 inline-block text-blue-600 hover:underline">
              Browse Categories
            </Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Quality Guaranteed</h2>
            <p className="text-gray-600">We source only the best parts to ensure your vehicle runs smoothly.</p>
            <Link href="/about" className="mt-4 inline-block text-blue-600 hover:underline">
              Learn More
            </Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Fast Shipping</h2>
            <p className="text-gray-600">Get your parts delivered quickly across Australia.</p>
            <Link href="/cart" className="mt-4 inline-block text-blue-600 hover:underline">
              Start Shopping
            </Link>
          </div>
        </div>

        {/* Placeholder for featured products or promotions */}
        <section className="my-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <p className="text-gray-600">Discover our top-selling and newly arrived auto parts.</p>
          {/* Product grid or carousel would go here */}
          <div className="mt-8">
            <Link href="/search" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              View All Products
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}