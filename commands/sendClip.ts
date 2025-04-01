import { SlashCommandBuilder, Interaction } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName('send-clip')
  .setDescription('Submits a toribash clip for approval');

export async function execute(interaction:Interaction) {
  return
}