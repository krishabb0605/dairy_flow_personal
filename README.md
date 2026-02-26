# Dairy Flow

> Full-stack DairyFlow delivery management system with a NestJS backend and a Next.js UI.

**Repo Structure**

- `backend/` NestJS API, Prisma, PostgreSQL, Stripe
- `ui/` Next.js App Router frontend, Firebase Auth, Cloudinary

## Prerequisites

- Node.js + npm
- PostgreSQL
- Firebase project (Auth enabled)
- Cloudinary account (for uploads)
- Stripe account (backend billing)

## Clone or download

```terminal
git clone https://github.com/The-Flex-Team/dairy-flow.git
```

## Backend Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment variables in `backend/.env`

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public
PORT=3001
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CHECKOUT_SUCCESS_URL=http://localhost:3000/billing
STRIPE_CHECKOUT_CANCEL_URL=http://localhost:3000/billing
```

3. Initialize database (Prisma)

```bash
npm run db:generate
npm run db:push
```

4. Run the backend

```bash
npm run start:dev
```

Backend defaults to `http://localhost:3001`.

## UI Setup

1. Install dependencies

```bash
cd ui
npm install
```

2. Configure environment variables in `ui/.env`

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3001

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Run the UI

```bash
npm run dev
```

UI defaults to `http://localhost:3000`.

## Environment Variable Details

**Backend (`backend/.env`)**

1. `DATABASE_URL`
   Use your PostgreSQL connection string. Format:
   `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public`
2. `PORT`
   Port where NestJS listens. Default is `3001`.
3. `STRIPE_SECRET_KEY`
   From Stripe Dashboard → Developers → API keys.
4. `STRIPE_WEBHOOK_SECRET`
   From Stripe Dashboard → Developers → Webhooks → select your endpoint.
5. `STRIPE_CHECKOUT_SUCCESS_URL`
   Where Stripe redirects after a successful checkout (UI route).
6. `STRIPE_CHECKOUT_CANCEL_URL`
   Where Stripe redirects after a canceled checkout (UI route).

**UI (`ui/.env`)**

1. `NEXT_PUBLIC_BASE_URL`
   Backend API base URL. For local dev use `http://localhost:3001`.
2. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   From Cloudinary Dashboard → Product Environment → Cloud name.
3. `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   From Cloudinary → Settings → Upload → Upload presets. Use an unsigned preset.
4. `NEXT_PUBLIC_FIREBASE_*`
   From Firebase Console → Project settings → General → Your apps.

## Firebase Notes

1. Enable Email/Password in Firebase Console → Authentication → Sign-in method.

## Stripe Notes

1. Create a webhook endpoint in Stripe and use its signing secret in `STRIPE_WEBHOOK_SECRET`.
2. Ensure your success/cancel URLs match the UI domain.
