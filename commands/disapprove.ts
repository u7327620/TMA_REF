import {CommandInteraction, Interaction, PermissionsBitField, SlashCommandBuilder, TextChannel} from "discord.js"
import config from '../config.json' with { type: "json" };

export const name = "disapprove";

export const data = new SlashCommandBuilder()
  .setName("disapprove")
  .setDescription("disapproves a given clip")
  .addStringOption(option =>
    option.setName('url')
      .setDescription("The url of the clip to disapprove")
      .setRequired(true));

export async function execute(interaction:Interaction) {
  if (interaction.isButton()) {
    interaction.message.delete();
  }
  else {
    interaction.client.channels.fetch(config.clipsOnlyChannel).then(channel => {
      // @ts-ignore
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
        if(interaction.isRepliable()){
          interaction.reply("Only admins can use this command")
        }
        console.error(`Non admin user ${interaction.user.username} attempted to use disapprove(url)`)
      }
      if (!channel || !channel.isTextBased()) {
        console.error("Channel not found or not a text channel");
        return;
      }
      (channel as TextChannel).messages.fetch({ limit: 50 }).then((messages) => {
        // @ts-ignore
        let url = interaction.options.get('url');
        if (!url){
          console.error("No url given during disapprove command")
        }
        console.log(`Deleting ${url} called by ${interaction.user.username}`)
        // @ts-ignore bruh just lemme use the url response bruh
        messages.filter(msg => msg.content.includes(url))
        (channel as TextChannel).bulkDelete(messages, true)
      })
    })
  }
}