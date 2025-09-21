#! /bin/bash

# Install concurrently
npm install

# Install dependencies for server
cd server || exit
npm install

# Install dependencies for client
cd ..
cd client || exit
npm install

# Start localhost
cd ..
npm run dev