FROM node:23
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npx", "ts-node", "server.ts"]
