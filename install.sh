#! /bin/bash
npm install
cd server || exit
npm install
cd ..
cd client || exit
npm install
cd ..
npm run dev