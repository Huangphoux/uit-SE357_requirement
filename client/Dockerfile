FROM node:latest
WORKDIR /client

COPY package.json .
RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_HOST=0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]