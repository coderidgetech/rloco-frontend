#!/bin/bash

# Rloco - Clear Cache Script
# This script clears all development caches to resolve browser caching issues

echo "🧹 Rloco Cache Cleaner"
echo "======================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Starting cache cleanup..."
echo ""

# Step 1: Clear Vite cache
print_info "Clearing Vite cache..."
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    print_success "Vite cache cleared"
else
    print_warning "Vite cache not found (already clean)"
fi

# Step 2: Clear dist folder
print_info "Clearing dist folder..."
if [ -d "dist" ]; then
    rm -rf dist
    print_success "Dist folder cleared"
else
    print_warning "Dist folder not found (already clean)"
fi

# Step 3: Clear general cache
print_info "Clearing general cache..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    print_success "General cache cleared"
else
    print_warning "General cache not found (already clean)"
fi

# Step 4: Clear TypeScript cache
print_info "Clearing TypeScript cache..."
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm -f tsconfig.tsbuildinfo
    print_success "TypeScript cache cleared"
else
    print_warning "TypeScript cache not found (already clean)"
fi

echo ""
print_success "All caches cleared successfully!"
echo ""

# Provide next steps
echo "📋 Next Steps:"
echo "   1. Restart your development server (if running)"
echo "   2. Hard refresh your browser:"
echo "      • Windows/Linux: Ctrl + Shift + R"
echo "      • Mac: Cmd + Shift + R"
echo "   3. If issues persist, try:"
echo "      • Opening DevTools and disabling cache"
echo "      • Using incognito/private browsing mode"
echo ""

# Optional: Offer to start dev server
read -p "Would you like to start the development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development server..."
    npm run dev
fi
