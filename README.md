This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | The connection string for your database (e.g., PostgreSQL). |
| `BETTER_AUTH_SECRET` | A secret key used by Better Auth to encrypt session tokens and secure authentication. |
| `BETTER_AUTH_URL` | The base URL of your application (e.g., `http://localhost:3000`). |
| `RESEND_API_KEY` | API key from Resend for sending transactional emails (like verification and password reset). |
| `RESEND_FROM_EMAIL` | The sender email address for outward communications (e.g., `noreply@yourdomain.com`). |
| `NEXT_PUBLIC_APP_URL` | The public-facing URL of the application, used in client-side components. |
| `DODO_PAYMENTS_API_KEY` | API key for processing payments via Dodo Payments. |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | Secret key to verify Dodo Payments webhooks securely. |
| `DODO_STARTER_PRODUCT_ID` | Product ID for the Starter tier subscription in Dodo Payments. |
| `DODO_PRO_PRODUCT_ID` | Product ID for the Pro tier subscription in Dodo Payments. |
| `DODO_MAX_PRODUCT_ID` | Product ID for the Max tier subscription in Dodo Payments. |
| `GOOGLE_CLIENT_ID` | Client ID for enabling Google OAuth sign-in. |
| `GOOGLE_CLIENT_SECRET` | Client Secret for enabling Google OAuth sign-in. |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
