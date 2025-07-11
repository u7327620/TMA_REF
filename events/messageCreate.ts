import { Events, Message } from "discord.js";
import { clipsFromMessage, clipsApproval } from "../objects/toribash-clip.js";
import { client } from "../index.js";

export const name:Events.MessageCreate = Events.MessageCreate;
export const once: Boolean = false;
export function execute(message: Message<boolean>) {
  if (message.author.bot) return;

  if (message.attachments.size > 0 || message.embeds.length > 0) {
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