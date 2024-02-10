# Multiplayer Guess Games

This is a multiplayer game website built using Next.js, Tailwind CSS, and Socket.IO.
The website allows players to guess
the flag of a country or the name of a cocktail and compete with other players in real-time.

## Dev Setup

<details>
<summary>Run Project in Production Mode using Docker Compose</summary>

### Run Project in Production Mode

To get started, you will need to have [Docker](https://docs.docker.com/get-docker/) installed on your machine.
Once Docker is installed, you can run the
following command to start the application:

Start the docker-compose setup:

```bash
docker-compose up --build
```

This will start both the client and server applications,
and you can access the game by navigating to http://guessthething.localhost in your browser.

Client application will be running on http://guessthething.localhost, and the server application will be running on
http://api.guessthething.localhost.
</details>

<details>
<summary>Run Project in Dev Mode using GitPod</summary>

### Run Project in Dev Mode using GitPod

- First you need to install
  the [GitPod Browser Extension](https://www.gitpod.io/docs/configure/user-settings/browser-extension), then you can
  click
  on the button below to start the project in GitPod.

- Now you can start the project by clicking on the button next to the "Code" button in the top right corner:
  ![Screenshot](https://zockerbandewqhd.nimbusweb.me/box/attachment/10234588/7nyg6sosh611lkliibrf/d2CNYbWn5ULiwZFY/screenshot-github.com-2024.02.10-00_50_18.png)

- Login to GitPod and wait for the project to start.
    - The Project will be installed and started automatically.

- Access the Application by clicking on the "Open Browser" button in the bottom right corner:
  ![Screenshot](https://zockerbandewqhd.nimbusweb.me/box/attachment/10234594/641inbfau2ud6gp52pb9/TZ58Koy9NRng3CnD/screenshot-uhmarlon-guessthething-65249tt4ht3.ws-eu108.gitpod.io-2024.02.10-00_53_23.png)

- If you closed the notification, you can access the application by clicking on the `PORTS`-Tab and Click on "Open
  Browser" button:
  ![Screenshot](https://zockerbandewqhd.nimbusweb.me/box/attachment/10234622/l5qrxmhyrxx290r13x3o/H72UC7CAJyGb3NnD/screenshot-uhmarlon-guessthething-65249tt4ht3.ws-eu108.gitpod.io-2024.02.10-00_54_47.png)

#### Restarting the Project

- To stop the Project, you can click into the terminal and press `Ctrl + C`.
- To start the Project again, you can run the following command:
  ```bash
  ./startGitPod
  ```

*⚠️ ATTENTION:* The `.env`-file of the server is regularly not needed. In GitPod mode, the `.env`-file is copied from
the
client
and overwrites the one from the server.

</details>

<details>
<summary>Run Project in Development Mode using local NodeJS</summary>

### Run Project in Development Mode using local NodeJS

Choose the correct NPM Version using NVM:  
**Maybe you have to be the administrator of your system, so try to use sudo BUT JUST FOR NVM INSTALL**

```bash
sudo su
nvm install 
exit
nvm use
```

Install all npm dependencies:

```bash
npm run install-dependencies
```

Start the client application:

```bash
npm run dev-client
```

Start the server application in extra terminal:

```bash
npm run dev-server
```

The client application will be running on http://localhost:3000, and the server application will be running on
http://localhost:3001.
</details>

## Folder Structure

The project is divided into two folders:

- **client**: This folder contains the Next.js application that serves as the game's frontend.
- **server**: This folder contains the Socket.IO server that handles game logic and real-time communication between
  players.

## Games

The website currently has two games:

- **Guess The Flag**: Guess the flag of a country.
- **Guess The Cocktail**: Guess the name of a cocktail.

More games are coming soon!

## Contributing

Contributions to the project are always welcome!  
If you find a bug or have an idea for an improvement, feel free to
submit a pull request.

- *Keep in mind, that Frontend .env-Variables have to begin with `NEXT_PUBLIC_` to be accessible in the frontend.*
- https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser

- Before you submit a pull request, make sure that the project runs in every environment (Docker, GitPod, local NodeJS)
  or send a note if it is not testet in every environment.

## License

This project is licensed under the CC-BY-SA-4.0 License. See the [LICENSE](LICENSE) file for more information.

## Deploy

**Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/uhmarlon/guess-the-flag)
