# AT Digital Catalogue

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
- Product image URL support
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

Apply `supabase/schema.sql` in the Supabase SQL editor.

## Deployment
Deploy the Next.js app to Cloudflare Pages and use the free `*.pages.dev` URL for the QR code.
