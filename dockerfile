    FROM node:21.0.0

    RUN npm install -g pnpm@9.1.1

    WORKDIR /usr/src/app

    COPY package*.json ./

    RUN pnpm install 

    RUN pnpm run serverbuild

    EXPOSE 3005

    CMD ["pnpm", "serverstart"]
