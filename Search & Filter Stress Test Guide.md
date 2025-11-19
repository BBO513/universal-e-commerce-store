# Search & Filter Stress Test Guide

## 1. Generate Mock Data

This script will populate your PostgreSQL database with a large number of fake products and vehicles (10,000 products, 500 vehicles). This is crucial for stress testing your search and filter functionalities.

**Prerequisites:**
*   PostgreSQL server is running.
*   `auto_parts_store` database exists.
*   `schema.sql` has been run.
*   `@faker-js/faker` is installed in your project (`npm install @faker-js/faker`).

**Steps to Generate Mock Data:**

1.  **Ensure your database is clean (optional but recommended):**
    If you want to start with a fresh set of mock data, you can drop and recreate your database, then run `schema.sql` again.
    ```powershell
    # Drop and recreate database
    & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
    # In the psql prompt:
    DROP DATABASE IF EXISTS auto_parts_store;
    CREATE DATABASE auto_parts_store;
    \q

    # Run schema.sql
    & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d auto_parts_store -f schema.sql
    ```
    *Note: If you do this, you will also need to re-run `seed-database.sql` with the correct password hash if you want the admin user to be present.*

2.  **Run the mock data generation script:**
    Open a terminal in your project's root directory (`C:\Users\works\e-commers_auto_store\`) and run:
    ```bash
    node scripts/generate-mock-data.js
    ```
    This script will connect to your PostgreSQL database (using the `DATABASE_URL` from your `.env.local` file) and insert the mock data. It will log its progress to the console.

## 2. Perform Stress Testing

Once the mock data has been generated, you can perform manual stress testing on your search and filter functionalities.

**Steps for Manual Stress Testing:**

1.  **Ensure Frontend and Backend are Running:**
    *   Backend: `cd server` then `npm run dev`
    *   Frontend: `$env:PORT=3002; npx next dev`
    *   Ngrok: `ngrok http 3002` (if testing externally)
2.  **Navigate to the Search Page:** Open your browser and go to the `/search` page of your application (e.g., `http://localhost:3002/search` or your `ngrok` URL).
3.  **Test Search Functionality:**
    *   Enter various keywords into the search bar (e.g., "oil", "brake", "filter", "engine").
    *   Observe the response time and the number of results returned.
    *   Try searching for very common words to see how the system handles a large number of matches.
4.  **Test Filter Functionality:**
    *   Use the "Make" dropdown (which should now be populated with many vehicle makes). Select different makes.
    *   If other filters are implemented (e.g., price range, condition, model), test combinations of these filters.
    *   Observe the response time when applying filters.
5.  **Monitor Performance:**
    *   While testing, keep an eye on your browser's developer tools (Network tab) to see the time taken for API calls.
    *   Monitor your backend server's console for any errors or performance warnings.
    *   If possible, monitor your PostgreSQL database's resource usage (CPU, memory) during heavy querying.

**Expected Outcome:**
*   Search and filter operations should return results within a reasonable time (e.g., a few seconds at most, ideally much faster).
*   The application should remain responsive and not crash under load.
*   Backend API calls should complete without errors.

---

**Next Step:** I will move on to the "Cross-browser testing" feature.
