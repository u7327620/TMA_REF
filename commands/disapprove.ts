import {Interaction, SlashCommandBuilder } from "discord.js"

export const name = "disapprove";

export const data = new SlashCommandBuilder()
  .setName("disapprove")
  .setDescription("disapproves a given clip")
  .addStringOption(option =>
    option.setName('url')
      .setDescription("The url of the clip to disapprove")
      .setRequired(true));

export async function execute(interaction:Interaction) {
  console.log("Disapprove called");
  if (interaction.isButton()) {
    interaction.message.delete();
  }
}