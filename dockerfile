FROM node:21.0.0

RUN npm install -g pnpm@9.1.1
RUN pnpm install 


WORKDIR /apps/server

# Install pnpm globally
RUN npm install -g pnpm@9.1.1

# Rest of your Dockerfile instructions
COPY package*.json ./

COPY . .

RUN pnpm run serverbuild

EXPOSE 3005

CMD ["pnpm", "start"]
