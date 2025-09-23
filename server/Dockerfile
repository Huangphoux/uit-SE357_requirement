FROM node:latest
# RUN mkdir -p /api/config /api/src
WORKDIR /server

COPY package.json /server/package.json
COPY package-lock.json /server/package-lock.json

RUN npm install

CMD ["npm", "run", "dev"]