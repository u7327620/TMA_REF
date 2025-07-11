import {Interaction, REST, Routes, SlashCommandBuilder} from "discord.js";
import config from '../config.json' with { type: "json" };
import CommandClient from "../objects/commandClient.js";

export const name = "devsync";

export const data = new SlashCommandBuilder()
  .setName("devsync")
  .setDescription("Syncs only TMA")

export async function execute(interaction:Interaction) {
  const rest = new REST().setToken(config.token);
    try {
      let client = (interaction.client as CommandClient);
      console.log(`Started refreshing ${client.commands.toJSON().length} application (/) commands.`);

      // Guild specific is near instant
     await rest.put(Routes.applicationGuildCommands(config.clientId, config.devGuildId), { body: client.commands.toJSON() });
     await rest.put(Routes.applicationCommands(config.clientId), { body: [] })
    } catch (error) {
      console.error(error);
    }
  }
