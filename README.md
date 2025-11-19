# E-commerce Auto Store

This is a full-stack e-commerce application for an auto parts store.

## Environment Variables

To run this application, you will need to create a `.env.local` file in the root of the project and add the following environment variables:

| Variable                        | Description                                                                 |
| ------------------------------- | --------------------------------------------------------------------------- |
| `NEXTAUTH_SECRET`               | A secret key for NextAuth.js. You can generate one with `openssl rand -base64 32`. |
| `NEXTAUTH_URL`                  | The base URL of your application.                                           |
| `DATABASE_URL`                  | The connection string for your PostgreSQL database.                         |
| `STRIPE_SECRET_KEY`             | Your Stripe secret key.                                                     |
| `STRIPE_WEBHOOK_SECRET`         | Your Stripe webhook secret.                                                 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key.                                              |
| `EMAIL_HOST`                    | The hostname of your email server.                                          |
| `EMAIL_PORT`                    | The port of your email server.                                              |
| `EMAIL_USER`                    | The username for your email server.                                         |
| `EMAIL_PASS`                    | The password for your email server.                                         |
| `EMAIL_FROM`                    | The email address to send emails from.                                      |
| `CLOUDINARY_API_KEY`            | Your Cloudinary API Key (if used for image hosting).                        |
| `CLOUDINARY_SECRET`             | Your Cloudinary API Secret (if used for image hosting).                     |

## Database

This application uses a PostgreSQL database.

### Setup

1.  **Install PostgreSQL.**
2.  **Create a new database.**
3.  **Run the `schema.sql` file to create the necessary tables.**

You can run the `schema.sql` file using a tool like `psql`:

```bash
psql -d your_database_name -a -f schema.sql
```

## Deployment

This application is designed to be deployed to [Vercel](https://vercel.com/).

### Prerequisites

- A Vercel account.
- A PostgreSQL database (e.g., from [Vercel Postgres](https://vercel.com/storage/postgres) or [Supabase](https://supabase.com/)).
- A Stripe account.
- An email server (e.g., from [SendGrid](https://sendgrid.com/) or [Mailgun](https://www.mailgun.com/)).

### Steps

1.  **Fork this repository.**
2.  **Create a new project on Vercel.**
3.  **Connect your forked repository to the Vercel project.**
4.  **Configure the environment variables in the Vercel project settings.**
5.  **Deploy the application.**

Vercel will automatically detect that this is a Next.js application and will build and deploy it for you.

## Stripe Configuration

For production, you will need to configure Stripe with your live keys and verify the webhook endpoint.

### Steps

1.  **Switch to Live Keys:**
    *   In your Vercel project settings, update the `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` environment variables with your **live** Stripe API keys.
2.  **Verify Webhook Endpoint:**
    *   In your Stripe Dashboard, navigate to "Developers" -> "Webhooks".
    *   Add a new endpoint or update your existing one to point to your deployed application's webhook URL (e.g., `https://your-domain.com/api/checkout/webhook`).
    *   Ensure the webhook is configured to listen for the necessary events (e.g., `checkout.session.completed`, `payment_intent.succeeded`).
    *   Update the `STRIPE_WEBHOOK_SECRET` environment variable in Vercel with the new webhook secret provided by Stripe for your live endpoint.

