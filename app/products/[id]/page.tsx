'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { getProductById } from '@/lib/config';

const ProductDetailPage = () => {
  const params = useParams<{ id?: string }>();
  const productId = params?.id;
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    const foundProduct = getProductById(productId);
    if (!foundProduct) {
      setError('Product not found.');
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(foundProduct);
    const images = foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images : [foundProduct.image];
    setSelectedImage(images[0]);
    setLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product.id, quantity);
      alert(`${quantity} x ${product.title} added to cart!`);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading product...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">Product not found.</div>;
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg mb-4 border rounded-lg overflow-hidden bg-slate-100">
            <img
              src={selectedImage || '/placeholder.jpg'}
              alt={product.title}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((img: string, index: number) => (
              <button
                key={index}
                type="button"
                className={`w-20 h-20 overflow-hidden rounded-md border-2 ${selectedImage === img ? 'border-indigo-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl text-gray-800 font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="font-semibold">SKU:</span> {product.sku}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Condition:</span> {product.condition}
          </div>
          {product.brand && (
            <div className="mb-4">
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
          )}
          <div className="mb-4">
            <span className="font-semibold">Stock Status:</span>{' '}
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} in stock</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="font-semibold">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value, 10) || 1)))}
                className="w-24 border border-gray-300 rounded-md text-center py-2"
              />
              <button
                onClick={handleAddToCart}
                className="flex-grow py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
            </div>
          )}

          {product.stock <= 0 && (
            <button
              disabled
              className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-400 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          <Link href="/cart" className="block mt-4 text-center text-indigo-600 hover:underline">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;