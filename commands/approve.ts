import {Interaction, SlashCommandBuilder, TextChannel} from "discord.js"

const sendClipChannel:string = "762095632529227786"

export const name = "approve";

export const data = new SlashCommandBuilder()
  .setName("approve")
  .setDescription("Approves a given clip")
  .addStringOption(option =>
    option.setName('url')
      .setDescription("The url of the clip to approve")
      .setRequired(true));

export async function execute(interaction:Interaction) {
  console.log("Approve called");
  if (interaction.isButton()) {
    const link:string | undefined = interaction.message.content.split("\n").pop();

    if (!link) {
      console.error("Approve on button press found message with no splittable newlines");
      return
    }

    if(link.startsWith("http")) {
      interaction.client.channels.fetch(sendClipChannel).then(channel => {
        if (!channel || !channel.isTextBased()) {
          console.error("Channel not found or not a text channel");
          return;
        }
        (channel as TextChannel).send({content: `${link}`});
        interaction.message.delete();
      });
    }
  }
}