#!/bin/bash

# Deploy Prisma schema to Supabase via Fly.io (has IPv6 support)
# Run this script from the repo root

set -e

echo "📦 Deploying Prisma schema to Supabase..."
echo ""

# Copy prisma directory to ingestion-worker
echo "1️⃣ Copying Prisma files to ingestion-worker..."
cp -r prisma ingestion-worker/
echo "✅ Copied"
echo ""

# Add prisma to ingestion-worker dependencies temporarily
echo "2️⃣ Adding Prisma to ingestion-worker..."
cd ingestion-worker
npm install --save-dev prisma @prisma/client
echo "✅ Installed"
echo ""

# Deploy to Fly with updated files
echo "3️⃣ Deploying to Fly.io..."
flyctl deploy --no-cache
echo "✅ Deployed"
echo ""

# Run migrations on Fly
echo "4️⃣ Running migrations on Fly (has IPv6)..."
flyctl ssh console -C "npx prisma migrate deploy"
echo "✅ Migrations complete!"
echo ""

echo "🎉 Schema deployed to Supabase!"
echo ""
echo "Now you can run: flyctl ssh console -C 'npm run test:copy'"
