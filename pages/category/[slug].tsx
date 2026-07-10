import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import ProductCard from '../../components/ProductCard';
import ProductGridSkeleton from '../../components/ProductGridSkeleton';
import { getCategoryBySlug } from '../../lib/db';

const DynamicFilters = dynamic(() => import('../../components/Filters'), {
  suspense: true,
  ssr: false,
});

interface CategoryPageProps {
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
  initialProducts: any[];
  totalProducts: number;
  currentPage: number;
  limit: number;
}

export default function CategoryPage({
  category,
  initialProducts = [],
  totalProducts = 0,
  currentPage = 1,
  limit = 20,
}: CategoryPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [currentTotalProducts, setCurrentTotalProducts] = useState(totalProducts || 0);
  const [currentCurrentPage, setCurrentCurrentPage] = useState(currentPage || 1);

  const totalPages = Math.ceil(currentTotalProducts / limit);

  useEffect(() => {
    // Re-fetch products when router query changes (filters, sort, page)
    const fetchProductsOnRouteChange = async () => {
      setLoading(true);
      const queryString = new URLSearchParams({
        ...router.query as Record<string, string>,
        category_id: category.id.toString(), // Ensure category_id is always present
      }).toString();
      const res = await fetch(`/api/products/advanced-search?${queryString}`); // Use advanced-search API
      const data = await res.json();
      setProducts(data.products);
      setCurrentTotalProducts(data.totalProducts);
      setCurrentCurrentPage(parseInt(router.query.page as string || '1', 10));
      setLoading(false);
    };

    fetchProductsOnRouteChange();
  }, [router.query, category.id]);

  const handlePageChange = (page: number) => {
    const newQuery = { ...router.query, page: page.toString() };
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  const getFilterTags = () => {
    const tags = [];
    const { query, page, limit, sortBy, slug, ...activeFilters } = router.query; // Exclude slug

    if (activeFilters.brand) {
      tags.push({ key: 'brand', value: activeFilters.brand as string, label: `Brand: ${activeFilters.brand}` });
    }
    if (activeFilters.condition) {
      tags.push({ key: 'condition', value: activeFilters.condition as string, label: `Condition: ${activeFilters.condition}` });
    }
    if (activeFilters.minPrice || activeFilters.maxPrice) {
      const min = activeFilters.minPrice || '0';
      const max = activeFilters.maxPrice || 'Max';
      tags.push({ key: 'priceRange', value: `${min}-${max}`, label: `Price: $${min} - $${max}` });
    }
    // category_id is inherent to the page, so not a removable filter tag here
    if (activeFilters.searchQuery) {
      tags.push({ key: 'searchQuery', value: activeFilters.searchQuery as string, label: `Keyword: "${activeFilters.searchQuery}"` });
    }

    return tags;
  };

  const handleRemoveFilter = (key: string, value?: string) => {
    const newQuery = { ...router.query };
    if (key === 'priceRange') {
      delete newQuery.minPrice;
      delete newQuery.maxPrice;
    } else if (key === 'searchQuery') {
      delete newQuery.searchQuery;
    }
    else {
      delete newQuery[key];
    }
    newQuery.page = '1'; // Reset page when a filter is removed
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  const activeFilterTags = getFilterTags();

  if (!category) {
    return <div className="text-center py-8">Category not found.</div>;
  }

  const pageTitle = category.name;
  const pageDescription = category.description || `Browse ${category.name} products in our store.`;
  const pageKeywords = `${category.name}, ${category.slug}`;
  const canonicalUrl = `https://www.yourdomain.com/category/${category.slug}`; // TODO: Replace with actual domain
  const ogImage = "/og-image.jpg"; // Placeholder for Open Graph image

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
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={`${category.name} Category Image`} />
      </Head>
      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        <div className="md:w-1/4 pr-4">
          <Suspense fallback={<div>Loading Filters...</div>}>
            <DynamicFilters />
          </Suspense>
        </div>
        <div className="md:w-3/4">
          <nav className="text-sm breadcrumbs mb-4">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{category.name}</li>
            </ul>
          </nav>

          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-gray-600 mb-6">{category.description}</p>}

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilterTags.map((tag) => (
                <span
                  key={tag.key + tag.value}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(tag.key)}
                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                  >
                    <span className="sr-only">Remove filter</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={() => router.push({ pathname: router.pathname, query: { slug: router.query.slug } })} // Clear all filters except category slug
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products found in this category.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={parseFloat(product.price)}
                    images={product.images || []}
                    condition={product.condition as 'new' | 'used'}
                    stock={product.stock}
                    brand={product.brand}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        page === currentCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page = '1', limit = '20', ...filters } = context.query;

  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { notFound: true };
  }

  const queryString = new URLSearchParams({
    ...filters as Record<string, string>,
    category_id: category.id.toString(),
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  try {
    const productsRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products/advanced-search?${queryString}` // Use advanced-search API
    );
    const productsData = await productsRes.json();

    return {
      props: {
        category,
        initialProducts: productsData.products || [],
        totalProducts: productsData.totalProducts || 0,
        currentPage: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 20,
      },
    };
  } catch (error) {
    console.error('Error fetching products for category:', error);
    return {
      props: {
        category,
        initialProducts: [],
        totalProducts: 0,
        currentPage: 1,
        limit: 20,
      },
    };
  }
};