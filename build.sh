#!/usr/bin/env bash
# exit on error
set -o errexit

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build complete!"
