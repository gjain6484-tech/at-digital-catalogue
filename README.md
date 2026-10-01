# Aarti Trading Digital Catalogue

Free QR-accessible digital product catalogue with a public storefront and admin panel.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Cloudflare Pages-ready

## Features
- Public product catalogue
- Category filtering and search
- Admin login
- Add, edit, delete and publish/unpublish products
- Direct product image upload from the admin panel
- Supabase Storage for product images
- Supabase Row Level Security

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Apply `supabase/schema.sql` in the Supabase SQL editor. This creates the `products` table and the public `product-images` storage bucket with authenticated upload/delete policies.

Create an admin user in Supabase Authentication and use that email/password at `/admin/login`.

## Deployment
Deploy the Next.js app to Cloudflare Pages and use the free `*.pages.dev` URL for the QR code.
