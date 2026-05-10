FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=build /app /app

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/index.js"]