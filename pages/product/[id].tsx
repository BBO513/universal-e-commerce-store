import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getProductById, getCategoryById, Review } from '../../lib/db';
import FadeAspectImage from '../../components/FadeAspectImage';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewForm from '../../components/reviews/ReviewForm';
import { StarRating } from '../../components/StarRating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ProductDetailPageProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    sku: string;
    condition: 'new' | 'used';
    stock: number;
    images: string[];
    category_id?: number;
    brand?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
  hasPurchased: boolean;
}

export default function ProductDetailPage({ product, category, averageRating, reviewCount, reviews, hasPurchased }: ProductDetailPageProps) {
  const { data: session } = useSession();
  const [mainImage, setMainImage] = useState(product.images?.[0] || '/placeholder-image.png');
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState({ AUD: 1, USD: 0.67, EUR: 0.61 });
  const [quantity, setQuantity] = useState(1);
  const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews);
  const [currentAverageRating, setCurrentAverageRating] = useState<number>(averageRating);
  const [currentReviewCount, setCurrentReviewCount] = useState<number>(reviewCount);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/wishlist/status?productId=${product.id}`);
          if (response.ok) {
            const data = await response.json();
            setIsWishlisted(data.inWishlist);
          }
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };
    checkWishlistStatus();
  }, [session, product.id]);

  const formatPrice = (value: number) => {
    const convertedPrice = value * exchangeRates[currency];
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
    }).format(convertedPrice);
  };

  const getStockStatus = (currentStock: number) => {
    if (currentStock === 0) {
      return <span className="text-red-600 font-semibold">Out of stock</span>;
    } else if (currentStock < 10) {
      return <span className="text-yellow-600 font-semibold">Low stock</span>;
    } else {
      return <span className="text-green-600 font-semibold">In stock</span>;
    }
  };

  const handleAddToCart = () => {
    addItem(parseInt(product.id, 10), quantity);
  };

  const handleSubmitReview = async (rating: number, title: string, comment: string) => {
    try {
      const response = await fetch(`/api/products/${product.id}/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, title, comment }),
      });

      if (response.ok) {
        alert('Review submitted successfully! It will be visible after moderation.');
        // Optionally, re-fetch reviews to update the list, or add a pending review to the state
        const reviewsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${product.id}/reviews`);
        const reviewData = await reviewsRes.json();
        setCurrentReviews(reviewData.reviews);
        setCurrentAverageRating(reviewData.averageRating);
        setCurrentReviewCount(reviewData.reviewCount);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An unexpected error occurred while submitting your review.');
    }
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      alert('Please log in to manage your wishlist.');
      return;
    }

    try {
      let response;
      if (isWishlisted) {
        response = await fetch('/api/wishlist/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        });
      } else {
        response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        });
      }

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        alert(isWishlisted ? 'Removed from wishlist!' : 'Added to wishlist!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update wishlist: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('An unexpected error occurred while updating your wishlist.');
    }
  };

  if (!product) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  const pageTitle = `${product.title} - ${category ? category.name : 'Auto Parts'} | Australian Automotive Parts Store`;
  const pageDescription = product.description.substring(0, 160); // Truncate for meta description
  const pageKeywords = `${product.title}, ${category ? category.name : ''}, ${product.brand}, auto parts, car parts, automotive, Australia`;
  const canonicalUrl = `https://www.yourdomain.com/product/${product.id}`; // TODO: Replace with actual domain
  const ogImage = product.images?.[0] || '/og-image.jpg'; // Use first product image or a fallback

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'AUD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: product.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviewCount,
      },
    }),
    ...(category && {
      category: category.name,
    }),
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={product.title} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="AUD" />

        {/* JSON-LD Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>
      <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
        <nav className="text-sm breadcrumbs mb-4">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            {category && (
              <li>
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </li>
            )}
            <li>{product.title}</li>
          </ul>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Image Gallery */}
          <div className="md:w-1/2">
            <FadeAspectImage
            src={mainImage}
            alt={product.title}
            aspect="aspect-video"
            wrapperClassName="w-full"
            className="object-contain"
          />
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(image)}
                  className={`relative w-20 ${image === mainImage ? 'ring-2 ring-boutique-accent' : ''} rounded-3xl overflow-hidden shrink-0`}
                >
                  <FadeAspectImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    aspect="aspect-square"
                    wrapperClassName="w-full"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <StarRating rating={currentAverageRating} />
              <span className="ml-2 text-gray-600">({currentReviewCount} reviews)</span>
            </div>
            <p className="text-gray-600 text-lg mb-4">SKU: {product.sku || 'N/A'}</p>
            <p className="text-5xl font-extrabold text-blue-600 mb-4">{formatPrice(product.price)}</p>

            <div className="hidden md:flex items-center gap-4 mb-4"> {/* Hidden on mobile */}
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  product.condition === 'new' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                }`}
              >
                {product.condition === 'new' ? 'New' : 'Used'}
              </span>
              {getStockStatus(product.stock)}
            </div>

            <div className="hidden md:flex items-center gap-4 mb-6"> {/* Hidden on mobile */}
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                className="w-20 p-2 border rounded-md text-center h-11" // Added h-11 for min 44px height
              />
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-green-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-700 transition-colors h-11" // Added h-11 for min 44px height
              >
                Add to Cart
              </button>
              {session && ( // Only show wishlist button if user is logged in
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg transition-colors h-11 w-11 flex items-center justify-center ${ // Added h-11 w-11 for min 44x44px
                    isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Specifications (Placeholder) */}
            <h2 className="text-2xl font-bold mb-2">Specifications</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-500">Specifications will be displayed here in a table format.</p>
              {/* Example:
              <table className="min-w-full bg-white">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200 font-semibold">Weight</td>
                    <td className="py-2 px-4 border-b border-gray-200">5 kg</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Material</td>
                    <td className="py-2 px-4 border-b border-gray-200">Aluminum</td>
                  </tr>
                </tbody>
              </table>
              */}
            </div>
          </div>
        </div>

        {/* Sticky Add to Cart for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40 md:hidden">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-20 p-2 border rounded-md text-center h-11" // Added h-11 for min 44px height
            />
            <button
              onClick={handleAddToCart}
              className="flex-grow bg-green-600 text-white text-lg font-bold py-2 rounded-lg hover:bg-green-700 transition-colors h-11" // Added h-11 for min 44px height
            >
              Add to Cart - {formatPrice(product.price * quantity)}
            </button>
            {session && (
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg transition-colors h-11 w-11 flex items-center justify-center ${ // Added h-11 w-11 for min 44x44px
                  isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-12">
          <ReviewList reviews={currentReviews} />
          {hasPurchased && <ReviewForm productId={product.id} onSubmit={handleSubmitReview} />}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const session = await getSession(context);

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  const productRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`);
  const product = await productRes.json();

  if (!product || productRes.status === 404) {
    return { notFound: true };
  }

  let category = null;
  if (product.category_id) {
    const categoryRes = await fetch(`${process.env.NEXTAUTH_URL}/api/categories/${product.category_id}`);
    if (categoryRes.ok) {
      category = await categoryRes.json();
    }
  }

  // Fetch reviews and average rating
  const reviewsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}/reviews`);
  const reviewData = await reviewsRes.json();

  // Check if user has purchased the product
  let hasPurchased = false;
  if (session && session.user) {
    const hasPurchasedRes = await fetch(`${process.env.NEXTAUTH_URL}/api/account/orders/has-purchased/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie || '', // Pass cookies for session
      },
    });
    const hasPurchasedData = await hasPurchasedRes.json();
    hasPurchased = hasPurchasedData.hasPurchased;
  }

  return {
    props: {
      product,
      category: category || null,
      averageRating: reviewData.averageRating || 0,
      reviewCount: reviewData.reviewCount || 0,
      reviews: reviewData.reviews || [],
      hasPurchased: hasPurchased || false,
    },
  };
};