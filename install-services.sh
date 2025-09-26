#!/bin/bash

echo "📦 Installing Required Services for Waymore Transactional Emails Service"
echo "================================================"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew found"
fi

echo ""
echo "🍺 Installing PostgreSQL..."
brew install postgresql@15

echo ""
echo "🍺 Installing Redis..."
brew install redis

echo ""
echo "🚀 Starting services..."

# Start PostgreSQL
echo "Starting PostgreSQL..."
brew services start postgresql@15

# Start Redis
echo "Starting Redis..."
brew services start redis

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "🗄️  Setting up database..."

# Create database
createdb emailgateway 2>/dev/null || echo "Database 'emailgateway' already exists or user doesn't have permissions"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Services installed:"
echo "  - PostgreSQL 15 (running on port 5432)"
echo "  - Redis (running on port 6379)"
echo ""
echo "Next steps:"
echo "  1. Run: ./setup-local.sh"
echo "  2. Start the API: npm run dev"
echo "  3. Start the worker: npm run worker"
echo ""
echo "To stop services later:"
echo "  brew services stop postgresql@15"
echo "  brew services stop redis"
