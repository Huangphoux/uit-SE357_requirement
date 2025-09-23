FROM node:latest
EXPOSE 8000
RUN mkdir -p /app/public /app/src
WORKDIR /client

COPY package.json /client/package.json
COPY package-lock.json /client/package-lock.json

RUN npm install

CMD ["npm", "run", "dev"]