# Developer Guide

This guide provides information for developers working on the e-commerce platform.

## Project File Structure

The project follows a standard Next.js application structure with additional directories for components, contexts, and API routes.

-   `pages/`: Contains Next.js pages and API routes.
    -   `pages/api/`: Backend API endpoints.
    -   `pages/admin/`: Admin-specific frontend pages.
    -   `pages/product/[id].tsx`: Dynamic product detail page.
-   `components/`: Reusable React components.
    -   `components/admin/`: Admin-specific components.
    -   `components/reviews/`: Review-related components.
-   `context/`: React Context API for global state management (e.g., CartContext, CurrencyContext).
-   `lib/`: Utility functions, database interactions, authentication logic.
    -   `lib/db.ts`: Database connection and query functions.
    -   `lib/auth.ts`: NextAuth.js configuration and helper functions.
-   `public/`: Static assets (images, manifest, service worker).
-   `styles/`: Global CSS styles.
-   `server/`: (If applicable) Separate backend server for specific functionalities.
-   `docs/`: Project documentation (this directory).
-   `next.config.js`: Next.js configuration.
-   `next-i18next.config.js`: Internationalization configuration.
-   `package.json`: Project dependencies and scripts.
-   `schema.sql`: Database schema definition.

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd e-commers_auto_store
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory based on `.env.local.example`.
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
    NEXTAUTH_URL="http://localhost:3000"
    STRIPE_SECRET_KEY="sk_test_YOUR_STRIPE_SECRET_KEY"
    STRIPE_WEBHOOK_SECRET="whsec_YOUR_STRIPE_WEBHOOK_SECRET"
    CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
    CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
    ```
    *Ensure your `DATABASE_URL` points to a local PostgreSQL instance.*
4.  **Set up the database:**
    *   Ensure you have PostgreSQL running locally.
    *   Run the `schema.sql` file to create tables:
        ```bash
        psql -U user -d mydatabase -f schema.sql
        ```
5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be accessible at `http://localhost:3000`.

## How to Deploy

This application is designed for deployment on Vercel.

1.  **Vercel Account:** Ensure you have a Vercel account and the Vercel CLI installed.
2.  **Link Project:** Link your local project to a Vercel project.
3.  **Environment Variables:** Configure all necessary environment variables in your Vercel project settings (as detailed in `docs/configuration.md`).
4.  **Database:** Ensure your production database is accessible from Vercel and migrations have been run.
5.  **Deploy:** Push your changes to your Git repository, and Vercel will automatically deploy. You can also deploy manually using `vercel --prod`.

## How to Work with API Routes

API routes are located in the `pages/api/` directory.

-   Each file in `pages/api/` becomes an API endpoint (e.g., `pages/api/products.ts` maps to `/api/products`).
-   API routes use Node.js and can interact with the database, external services, and handle authentication.
-   Use `req` and `res` objects for handling HTTP requests and responses.
-   Authentication is typically handled using `next-auth` in `pages/api/auth/[...nextauth].ts`.

## How to Add New Components or Features

1.  **Components:**
    *   Create new `.tsx` files in the `components/` directory (or a relevant subdirectory).
    *   Ensure components are reusable and follow existing styling conventions (e.g., Tailwind CSS).
    *   Use React's functional components and hooks.
2.  **Features:**
    *   **New Pages:** Create new `.tsx` files in the `pages/` directory.
    *   **New API Endpoints:** Create new `.ts` files in the `pages/api/` directory.
    *   **State Management:** Utilize React Context (from `context/`) for global state or `useState`/`useReducer` for local component state.
    *   **Data Fetching:** Use `getServerSideProps` or `getStaticProps` for server-side data fetching on pages, or client-side fetching with `fetch` or a library like `SWR`/`React Query`.

## Database Schema Reference

The database schema is defined in `schema.sql`. It typically includes tables for:

-   `users`: User authentication and profile information.
-   `products`: Product details, inventory.
-   `categories`: Product categories.
-   `orders`: Customer orders.
-   `order_items`: Items within an order.
-   `reviews`: Product reviews.
-   `addresses`: User addresses.
-   `wishlist`: User wishlist items.
-   `sessions`, `accounts`, `verificationtokens`: (NextAuth.js related tables).

Refer to `schema.sql` for the most up-to-date and detailed schema definition.
