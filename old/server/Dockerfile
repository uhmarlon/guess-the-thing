FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD ["npm", "run", "dev"]