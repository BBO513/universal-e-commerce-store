import { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, getAllCategories } from '../../lib/db';

const generateSitemap = (products, categories) => {
  const baseUrl = 'https://your-domain.com'; // Replace with your actual domain

  const staticPages = [
    '/',
    '/cart',
    '/search',
    '/login',
    '/register',
    '/account',
    '/account/orders',
    '/account/settings',
    '/account/wishlist',
    '/checkout/address',
    '/checkout/payment',
    '/checkout/review',
    '/checkout/shipping',
    '/checkout/success',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((url) => `
          <url>
            <loc>${baseUrl}${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `)
        .join('')}
      ${categories
        .map(({ slug }) => `
          <url>
            <loc>${baseUrl}/category/${slug}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
          </url>
        `)
        .join('')}
      ${products
        .map(({ id }) => `
          <url>
            <loc>${baseUrl}/product/${id}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
          </url>
        `)
        .join('')}
    </urlset>
  `;

  return sitemap;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getAllCategories(),
    ]);

    const sitemap = generateSitemap(products, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end();
  }
}
