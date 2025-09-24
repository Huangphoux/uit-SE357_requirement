::: Install concurrently
call npm install --verbose
:: Install dependencies for server
cd client
call npm install --verbose
:: Install dependencies for client
cd ..
cd server
call npm install --verbose
:: Start localhost
cd ..
call npm run dev