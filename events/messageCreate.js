module.exports = (client, message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0 || message.embeds.length > 0) {
    const cmd = client.commands.get("sendClip");
    if (!cmd) return;
    cmd.run(client, message);
  }
}
