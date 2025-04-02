import { Events, Interaction, MessageFlagsBitField } from "discord.js"
import CommandClient, {Command} from "../objects/commandClient.js";

export const name:Events.InteractionCreate = Events.InteractionCreate;
export const once: Boolean = false;
export async function execute(interaction:Interaction) {
  if (interaction.isChatInputCommand()) return;

  console.log("Handling interaction");
  const myClient:CommandClient = interaction.client as CommandClient;
  if(typeof myClient.commands == 'undefined') {console.error("No commands in client"); return;}

  if(interaction.isButton()){
    const command:Command | undefined = myClient.commands.get(interaction.customId);
    if (!command) {
      console.error(`No command matching ${interaction.customId} was found.`);
      return;
    }

    console.log(`Calling: ${command.name}`);

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
}