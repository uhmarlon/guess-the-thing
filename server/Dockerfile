FROM node:19
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]