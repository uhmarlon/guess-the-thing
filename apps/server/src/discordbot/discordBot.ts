import {
  Client,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
  Message,
} from "discord.js";
import * as dotenv from "dotenv";
import GameDataManager from "../socket/gameDataManager";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = "705749365079277569";
const SERVER_ID = "702575294095294609";
const UPDATE_INTERVAL = 3 * 60 * 1000; // 3 Minuten

if (!DISCORD_TOKEN) {
  console.warn(
    "DISCORD_TOKEN is not provided. Discord bot will not be started."
  );
} else {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once("ready", async () => {
    console.log("\x1b[35m%s\x1b[0m", "✨[ GTT Discord - is UP ]✨");

    try {
      const guild = await client.guilds.fetch(SERVER_ID);
      const channel = guild.channels.cache.get(CHANNEL_ID) as TextChannel;

      if (!channel) {
        console.error("Channel not found!");
        return;
      }

      const messages = await channel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();
      if (lastMessage?.author.bot) {
        await lastMessage.delete();
      }

      const serverStatusMessage = await postServerStatus(channel);

      setInterval(async () => {
        await updateServerStatus(serverStatusMessage);
      }, UPDATE_INTERVAL);
    } catch (error) {
      handleError("Error initializing bot: ", error);
    }
  });

  client.on("messageCreate", async (message: Message) => {
    if (message.content === "!ping") {
      try {
        const activeLobbiesCount =
          await GameDataManager.getActiveLobbiesCount();
        const connectedUsersCount =
          await GameDataManager.getConnectedUsersCount();

        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x8a24ff)
              .setTitle("Guess The Thing")
              .setDescription(
                "Information about Lobbys and Player in Guess The Thing"
              )
              .addFields(
                {
                  name: "Active Lobbies",
                  value: activeLobbiesCount.toString(),
                  inline: true,
                },
                {
                  name: "Connected Users",
                  value: connectedUsersCount.toString(),
                  inline: true,
                }
              ),
          ],
        });
      } catch (error) {
        handleError("Error fetching lobby or user data: ", error);
        await message
          .reply("An error occurred while fetching the data.")
          .catch(console.error);
      }
    }
  });

  client.login(DISCORD_TOKEN).catch((error) => {
    handleError("Error logging in: ", error);
  });
}

async function postServerStatus(channel: TextChannel): Promise<Message> {
  try {
    const embed = await generateServerStatusEmbed();
    const message = await channel.send({ embeds: [embed] });
    return message;
  } catch (error) {
    handleError("Error posting server status: ", error);
    throw error;
  }
}

async function updateServerStatus(message: Message): Promise<void> {
  try {
    const embed = await generateServerStatusEmbed();
    await message.edit({ embeds: [embed] });
  } catch (error) {
    handleError("Error updating server status: ", error);
  }
}

async function generateServerStatusEmbed(): Promise<EmbedBuilder> {
  try {
    const activeLobbiesCount = await GameDataManager.getActiveLobbiesCount();
    const connectedUsersCount = await GameDataManager.getConnectedUsersCount();
    const uptime = process.uptime();

    return new EmbedBuilder()
      .setColor(0x8a24ff)
      .setTitle("Guess The Thing - Server Status")
      .setDescription("Current server status and statistics")
      .addFields(
        {
          name: "Active Lobbies",
          value: activeLobbiesCount.toString(),
          inline: true,
        },
        {
          name: "Connected Users",
          value: connectedUsersCount.toString(),
          inline: true,
        },
        { name: "Server Uptime", value: formatUptime(uptime), inline: true }
      );
  } catch (error) {
    handleError("Error generating server status embed: ", error);
    throw error;
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function handleError(message: string, error: unknown): void {
  console.error("Discord bot: " + message, error);
}
