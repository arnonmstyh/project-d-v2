#!/bin/bash

echo "Starting ASA to FortiGate Converter..."
echo

echo "Installing dependencies..."
npm run install-all

echo
echo "Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo

npm run dev
