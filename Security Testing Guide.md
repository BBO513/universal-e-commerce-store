# Security Testing Guide

## 1. Verify Password Hashing

**Status:** Implemented. Your application uses `bcrypt` for password hashing, as seen in `lib/auth.ts`. This is a strong, industry-standard hashing algorithm.

**How to Verify:**
1.  **Access your PostgreSQL database:** Use `psql` or a GUI tool like pgAdmin.
2.  **Query the `users` table:**
    ```sql
    SELECT id, email, password_hash FROM users;
    ```
3.  **Inspect `password_hash`:** Ensure the `password_hash` values are long, complex strings starting with `$2b$10$...`. This confirms that `bcrypt` has been applied. If you see plain text passwords, there's a critical issue.

## 2. Test for SQL Injection

**Status:** Mitigated. Your application uses parameterized queries (e.g., `$1`, `$2`) in `lib/db.ts` for all database interactions. This is the primary defense against SQL injection.

**How to Test (Manual):**
1.  **Identify input fields:** Look for any user input fields that interact with the database (e.g., search bars, login forms, product creation forms, review submissions).
2.  **Inject malicious strings:** In these input fields, try entering common SQL injection payloads.
    *   **Example Payloads:**
        *   `' OR '1'='1`
        *   `' OR 1=1 --`
        *   `' UNION SELECT null, null, null --` (adjust number of nulls based on columns)
        *   `'; DROP TABLE users; --` (Be extremely cautious with this one, only in a test environment!)
3.  **Observe behavior:**
    *   **Expected:** The application should either return no results, an error message indicating invalid input, or simply treat the input as a literal string without altering the query logic.
    *   **Unexpected (Vulnerability):** If the application returns unexpected data, allows you to bypass authentication, or executes unintended database commands, it's vulnerable.

## 3. Test for XSS (Cross-Site Scripting)

**Status:** Requires vigilance. XSS prevention relies on proper input sanitization and output encoding. Next.js and React generally handle output encoding for JSX, but raw HTML or dangerously set inner HTML can be vulnerable.

**How to Test (Manual):**
1.  **Identify input fields:** Look for any user input fields where the input is later displayed on the page (e.g., product descriptions, review comments, user profiles, search results).
2.  **Inject malicious scripts:** In these input fields, try entering common XSS payloads.
    *   **Example Payloads:**
        *   `<script>alert('XSS');</script>`
        *   `<img src="x" onerror="alert('XSS')">`
        *   `<body onload=alert('XSS')>`
        *   `<a href="javascript:alert('XSS')">Click me</a>`
3.  **Observe behavior:**
    *   **Expected:** The script should not execute. The browser should either display the raw script text, or the script tags should be escaped/sanitized.
    *   **Unexpected (Vulnerability):** If an `alert` box pops up, or any other JavaScript code executes, the application is vulnerable to XSS.

**Code Fixes (General Guidance):**

*   **Input Sanitization:** For any user-generated content that will be stored and later displayed, consider sanitizing the input on the server-side before saving it to the database. Libraries like `DOMPurify` (for Node.js) can help.
*   **Output Encoding:** When rendering user-generated content, always ensure it's properly encoded. React's JSX automatically escapes content, but be careful when using `dangerouslySetInnerHTML`. If you must use it, ensure the content has been thoroughly sanitized first.

---

**Next Step:** I will move on to the "Search & filter stress test" feature.
