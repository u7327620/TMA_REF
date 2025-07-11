import { Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, TextChannel } from "discord.js";
import config from '../config.json' with { type: "json" };

export function clipsApproval(client: Client, clipToApprove: ToribashClip): void {
  const approve = new ButtonBuilder()
    .setCustomId("approve")
    .setLabel("Approve")
    .setStyle(ButtonStyle.Success);

  const disapprove = new ButtonBuilder()
    .setCustomId("disapprove")
    .setLabel("Disapprove")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(approve, disapprove);

  client.channels.fetch(config.approveClipChannel).then(channel => {
    if (!channel || !channel.isTextBased()) {
      console.error("Channel not found or not a text channel");
      return;
    }
    (channel as TextChannel).send({
      content: `${clipToApprove.message_url}\nSent By: ${clipToApprove.originator}\n${clipToApprove.clip_url}`, components: [row]
    });
  })
}

export function clipsFromMessage(message: Message): ToribashClip[] {
  const clips: ToribashClip[] = [];

  const videoAttachments = message.attachments.filter(attachment =>
    attachment.contentType == "video/mp4" ||
    attachment.contentType == "video/mov" ||
    attachment.contentType == "video/quicktime"||
    attachment.contentType == "image/gif")
  videoAttachments.forEach(attachment => {
    const toribashClip = new ToribashClip(message.url, message.author.username, attachment.url);
    console.log(toribashClip);
    clips.push(toribashClip);
  });

  const imgurGifRegex = /(?:https?:\/\/)?(?:i\.)?imgur\.com\/(?:gallery\/)?([a-zA-Z0-9]{5,})(?:\.gif|\.gifv)?/i;
  const gyazoGifRegex = /(?:https?:\/\/)?(?:i\.)?gyazo\.com\/([a-zA-Z0-9]{32})(?:\.gif)?/i;
  const discordCdnGifRegex = /https?:\/\/(?:cdn\.)?discordapp\.com\/attachments\/\d+\/\d+\/[^\s\/]+/i;

  for (const embed of message.embeds) {
    if (!embed.video && !embed.url){
      break
    }
    // @ts-ignore
    if (imgurGifRegex.test(embed.url) || gyazoGifRegex.test(embed.url) || discordCdnGifRegex.test(embed.url)){
      const toribashClip = new ToribashClip(message.url, message.author.username, <String>embed.url);
      console.log(toribashClip);
      clips.push(toribashClip);
    }
  }
  return clips;
}

export class ToribashClip {
  clip_url: String;
  message_url: String;
  originator: String;

  constructor(message_url: String, originator: String, clip_url: String) {
    this.clip_url = clip_url;
    this.message_url = message_url;
    this.originator = originator;
  }
}
