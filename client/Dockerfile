FROM node:latest
RUN mkdir -p /app/public /app/src
WORKDIR /client

COPY package.json /client/package.json
COPY package-lock.json /client/package-lock.json

RUN npm install

# EXPOSE 8000

CMD ["npm", "run", "dev"]