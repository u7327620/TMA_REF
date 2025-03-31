const { Events } = require("discord.js");
const { clipsFromMessage, clipsApproval } = require("../objects/toribash-clip.ts");
const client = require("../index.cjs");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute(message) {
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
      const clips = clipsFromMessage(message);
      if (clips.length != 0) {
        clips.forEach((clip) => { clipsApproval(client, clip) });
      }
    }
  }
};
