import { Message } from "discord.js";

function clipsFromMessage(message: Message): ToribashClip[] {
  const clips: ToribashClip[] = [];

  const videos = message.attachments.filter(attachment =>
    attachment.contentType == "video/mp4" ||
    attachment.contentType == "video/mov" ||
    attachment.contentType == "video/quicktime");
  videos.forEach(attachment => {
    const toribashClip = new ToribashClip(message.url, message.author.username, attachment.url);
    clips.push(toribashClip);
  });

  let gifs = message.content.split(" ").filter(word => /https?:\/\//.test(word));
  gifs = gifs.filter(link =>
    /discordapp.net/.test(link) ||
    /discordapp.com/.test(link) ||
    /discord.net/.test(link) ||
    /discord.com/.test(link) ||
    /imgur.com/ ||
    /gyazo.com/);
  gifs.forEach(link => {
    const toribashClip = new ToribashClip(message.url, message.author.username, link);
    clips.push(toribashClip);
  })
  return clips;
}

class ToribashClip {
  clip_url: String;
  message_url: String;
  originator: String;

  constructor(message_url: String, originator: String, clip_url: String) {
    this.clip_url = clip_url;
    this.message_url = message_url;
    this.originator = originator;
  }
}
