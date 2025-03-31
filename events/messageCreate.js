module.exports = (client, message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    const attachments = message.attachments.filter(attachment =>
      attachment.contentType == "video/mp4" ||
      attachment.contentType == "video/mov" ||
      attachment.contentType == "video/quicktime"
    );

  }
}
