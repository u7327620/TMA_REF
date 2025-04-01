import { Events, Message } from "discord.js";
import { clipsFromMessage, clipsApproval } from "../objects/toribash-clip.js";
import { client } from "../index.js";

export const name:Events.MessageCreate = Events.MessageCreate;
export const once: Boolean = false;
export function execute(message: Message<boolean>) {
  if (message.author.bot) return;

  const content = message.content.split(" ").filter((word) => word.startsWith("https://") || word.startsWith("http://"));
  const links = content.filter(link =>
    /discordapp.net/.test(link) ||
    /discordapp.com/.test(link) ||
    /discord.net/.test(link) ||
    /discord.com/.test(link) ||
    /imgur.com/ ||
    /gyazo.com/);

  if (message.attachments.size > 0 || message.embeds.length > 0 || links.length > 0) {
    try {
      const clips = clipsFromMessage(message);
      if (clips.length != 0) {
        clips.forEach((clip) => { clipsApproval(client, clip) });
      }
    } catch (e) {
      console.log(e);
    }
  }
}