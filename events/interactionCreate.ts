import { Events, Interaction, MessageFlagsBitField } from "discord.js"
import CommandClient, {Command} from "../objects/commandClient.js";

export const name:Events.InteractionCreate = Events.InteractionCreate;
export const once: Boolean = false;
export async function execute(interaction:Interaction) {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;

  const myClient:CommandClient = interaction.client as CommandClient;
  if(typeof myClient.commands == 'undefined') return;
  let command:Command | undefined = myClient.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
    }
  }
}