# Multiplayer Guess Games

This is a multiplayer game website built using Next.js, Tailwind CSS, and Socket.IO.
The website allows players to guess
the flag of a country or the name of a cocktail and compete with other players in real-time.

## Getting Started

To get started, you will need to have Docker installed on your machine.
Once Docker is installed, you can run the
following command to start the application:

## Dev Setup
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

Start the docker-compose setup:

```bash
docker-compose up --build
```

This will start both the client and server applications,
and you can access the game by navigating to http://guessthething.localhost in your browser.

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

## License

This project is licensed under the CC-BY-SA-4.0 License. See the [LICENSE](LICENSE) file for more information.

## Deploy

**Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/uhmarlon/guess-the-flag)
