FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM caddy:2-alpine

WORKDIR /srv

COPY --from=build /app/dist /srv

EXPOSE 80
