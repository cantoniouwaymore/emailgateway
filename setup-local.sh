#!/bin/bash

echo "🚀 Waymore Transactional Emails Service Local Development Setup"
echo "========================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ Created .env file"
fi

echo ""
echo "🔍 Checking system requirements..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client found"
    POSTGRES_AVAILABLE=true
else
    echo "⚠️  PostgreSQL client not found"
    POSTGRES_AVAILABLE=false
fi

# Check Redis
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis client found"
    REDIS_AVAILABLE=true
else
    echo "⚠️  Redis client not found"
    REDIS_AVAILABLE=false
fi

echo ""
echo "📦 Installing Node.js dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma client..."
npm run generate

echo ""
echo "🗄️  Database Setup Instructions:"
echo "================================"

if [ "$POSTGRES_AVAILABLE" = false ]; then
    echo ""
    echo "PostgreSQL is not installed. Choose one of these options:"
    echo ""
    echo "Option 1: Install with Homebrew (recommended for macOS)"
    echo "  brew install postgresql@15"
    echo "  brew services start postgresql@15"
    echo ""
    echo "Option 2: Install with MacPorts"
    echo "  sudo port install postgresql15"
    echo ""
    echo "Option 3: Use Docker (if you have Docker installed)"
    echo "  docker run --name emailgateway-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=emailgateway -p 5432:5432 -d postgres:15"
    echo ""
    echo "Option 4: Use a cloud database service"
    echo "  Update DATABASE_URL in .env with your cloud database connection string"
fi

echo ""
echo "🔄 Redis Setup Instructions:"
echo "============================"

if [ "$REDIS_AVAILABLE" = false ]; then
    echo ""
    echo "Redis is not installed. Choose one of these options:"
    echo ""
    echo "Option 1: Install with Homebrew (recommended for macOS)"
    echo "  brew install redis"
    echo "  brew services start redis"
    echo ""
    echo "Option 2: Install with MacPorts"
    echo "  sudo port install redis"
    echo ""
    echo "Option 3: Use Docker (if you have Docker installed)"
    echo "  docker run --name emailgateway-redis -p 6379:6379 -d redis:7-alpine"
    echo ""
    echo "Option 4: Use a cloud Redis service"
    echo "  Update REDIS_URL in .env with your cloud Redis connection string"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo ""
echo "1. Install PostgreSQL and Redis using one of the options above"
echo "2. Create the database:"
echo "   createdb emailgateway"
echo ""
echo "3. Run database migrations:"
echo "   npm run migrate"
echo ""
echo "4. Start the API server:"
echo "   npm run dev"
echo ""
echo "5. Start the worker (in another terminal):"
echo "   npm run worker"
echo ""
echo "6. Test the API:"
echo "   node test-api.js"
echo ""

# Check if services are already running
if [ "$POSTGRES_AVAILABLE" = true ]; then
    echo "🔍 Checking PostgreSQL connection..."
    if psql -h localhost -p 5432 -U postgres -d emailgateway -c "SELECT 1;" &> /dev/null; then
        echo "✅ PostgreSQL is running and accessible"
        echo "✅ Database 'emailgateway' exists"
        
        echo ""
        echo "🗄️  Running database migrations..."
        npm run migrate
    else
        echo "⚠️  PostgreSQL is not accessible. Please ensure:"
        echo "   - PostgreSQL is running"
        echo "   - Database 'emailgateway' exists"
        echo "   - User 'postgres' has access"
        echo ""
        echo "   Create database with: createdb emailgateway"
    fi
fi

if [ "$REDIS_AVAILABLE" = true ]; then
    echo "🔍 Checking Redis connection..."
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running and accessible"
    else
        echo "⚠️  Redis is not accessible. Please ensure Redis is running."
    fi
fi

echo ""
echo "🎉 Setup complete! Follow the next steps above to start the service."
