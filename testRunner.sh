#!/usr/bin/env bash

set -e  # Exit on first error

echo "🧪 Starting Test Runner..."

# ---------------------------------------------
# 1️⃣ Load environment variables safely
# ---------------------------------------------
if [ ! -f ".env.test" ]; then
    echo "❌ .env.test file not found"
    exit 1
fi

echo "📦 Loading test environment variables..."
set -a
source .env.test
set +a

# Ensure NODE_ENV is test
export NODE_ENV=test

# ---------------------------------------------
# 2️⃣ Run database migrations
# ---------------------------------------------
echo "📂 Running database migrations..."
npx sequelize-cli db:migrate

# ---------------------------------------------
# 3️⃣ Run seeders
# ---------------------------------------------
echo "🌱 Seeding test database..."
npx sequelize-cli db:seed:all

# ---------------------------------------------
# 4️⃣ Run Jest tests
# ---------------------------------------------
echo "🚀 Running test suite..."
npm run test

# ---------------------------------------------
# 5️⃣ Cleanup database
# ---------------------------------------------
echo "🧹 Cleaning up test database..."
npx sequelize-cli db:migrate:undo:all

echo "✅ Test run completed successfully"
