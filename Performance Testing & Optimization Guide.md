# Performance Testing & Optimization Guide

## 1. Google PageSpeed Insights

Google PageSpeed Insights is a tool that analyzes the content of a web page, then generates suggestions to make that page faster.

**Steps to use Google PageSpeed Insights:**

1.  **Open your browser:** Ensure your frontend server is running (e.g., on `http://localhost:3002`) and accessible via `ngrok` (e.g., `https://your-ngrok-url.ngrok-free.app`).
2.  **Go to PageSpeed Insights:** Open your web browser and navigate to [https://pagespeed.web.dev/](https://pagespeed.web.dev/).
3.  **Enter your URL:** In the input field, enter the `ngrok` URL of your AutoStore application (e.g., `https://735a46479c1d.ngrok-free.app`).
4.  **Analyze:** Click the "Analyze" button.
5.  **Review Results:** PageSpeed Insights will provide a score for both mobile and desktop, along with detailed recommendations for improvements in categories like Performance, Accessibility, Best Practices, and SEO.

**Focus Areas for Optimization based on PageSpeed Insights:**

*   **Core Web Vitals:** Pay close attention to metrics like Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and First Input Delay (FID).
*   **Image Optimization:** Look for suggestions related to "Serve images in next-gen formats" (WebP, AVIF) and "Efficiently encode images."
*   **JavaScript Optimization:** Check for "Reduce unused JavaScript" and "Minimize main-thread work."

## 2. Image Optimization (WebP/CDN)

### WebP Format

Next.js, when used with the `next/image` component, automatically handles image optimization, including serving images in modern formats like WebP (if the browser supports it and the image source allows it).

*   **Current Status:** Your `Product Detail Page (app/products/[id]/page.tsx)` already uses the `next/image` component, which is a good start.
*   **Action:** Ensure all images displayed on your site (e.g., product images, banners) are served through the `next/image` component.

### CDN Integration

For production, serving images from a Content Delivery Network (CDN) significantly improves load times by distributing content closer to users and offloading your main server.

*   **Current Status:** Your `seed-database.sql` uses local paths like `/images/products/`. For a CDN, these paths need to be updated.
*   **Action:**
    1.  **Choose a CDN Provider:** Select a CDN service (e.g., Cloudinary, AWS S3 + CloudFront, Vercel Blob, Imgix).
    2.  **Upload Images:** Upload your product images to the chosen CDN.
    3.  **Update Database:** Modify your database (e.g., the `images` column in the `products` table) to store the CDN URLs instead of local paths.
        *   **Example:** If a CDN URL is `https://mycdn.com/products/oil-filter-1.jpg`, update the database entry accordingly.
    4.  **Configure `next.config.js`:** If your CDN uses a custom domain, you might need to add it to the `images.domains` array in `next.config.js` to allow `next/image` to optimize images from that domain.
        *   **Example `next.config.js` snippet:**
            ```javascript
            /** @type {import('next').NextConfig} */
            const nextConfig = {
              images: {
                domains: ['mycdn.com', 'res.cloudinary.com'], // Add your CDN domain(s) here
              },
            };
            module.exports = nextConfig;
            ```
        *   **Action:** I will update `next.config.js` to include placeholder CDN domains.

## 3. JavaScript Bundle Minimization

Next.js automatically handles many JavaScript optimizations:

*   **Code Splitting:** Only the JavaScript needed for the current page is loaded.
*   **Tree Shaking:** Unused code is removed from bundles.
*   **Minification:** Code is compressed.

**Best Practices for further minimization:**

*   **Dynamic Imports (Lazy Loading):** For components that are not immediately visible or critical for the initial page load, use `next/dynamic` to lazy-load them.
    *   **Example:**
        ```typescript
        import dynamic from 'next/dynamic';
        const DynamicComponent = dynamic(() => import('../components/Hello'), {
          loading: () => <p>Loading...</p>,
        });
        // ... in your component
        <DynamicComponent />
        ```
*   **Remove Unused Libraries:** Regularly review your `package.json` and remove any dependencies that are no longer used.
*   **Analyze Bundles:** Use tools like `@next/bundle-analyzer` to visualize your JavaScript bundles and identify large dependencies.

---

**Next Step:** I will update `next.config.js` to include placeholder CDN domains for image optimization.
