import {Interaction, SlashCommandBuilder, TextChannel} from "discord.js";

export const name = "rankings";

export const data = new SlashCommandBuilder()
  .setName("rankings")
  .setDescription("Generates the rankings")
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription("The channel to send the rankings to")
      .setRequired(true));

export async function execute(interaction:Interaction) {
  console.log("Generating rankings");

}