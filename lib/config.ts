import productsData from '@/config/products.json';
import themeData from '@/config/theme.json';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  sku?: string;
  brand?: string;
  variants?: any;
  attributes?: any;
  categorySlug: string;
  categoryName: string;
  stock: number;
  condition: 'new' | 'used';
  tags: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface Theme {
  storeName: string;
  shortName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImage: string;
  buttonText: string;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    muted: string;
    accent: string;
    button: string;
    buttonText: string;
  };
  metadata: {
    title: string;
    description: string;
  };
  links: {
    home: string;
    catalog: string;
    search: string;
    account: string;
  };
}

export const products: Product[] = productsData.products as Product[];
export const theme: Theme = themeData as Theme;

export const categories: Category[] = Object.values(
  products.reduce<Record<string, Category>>((acc, product) => {
    if (!acc[product.categorySlug]) {
      acc[product.categorySlug] = {
        slug: product.categorySlug,
        name: product.categoryName,
        description: `Discover our premium ${product.categoryName.toLowerCase()} collection.`,
        count: 0,
      };
    }
    acc[product.categorySlug].count += 1;
    return acc;
  }, {})
);

export function getProductById(id: string) {
  return products.find((product) => product.id === id) || null;
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}
