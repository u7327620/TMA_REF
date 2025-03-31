import { clipsFromMessage } from '../objects/toribash-clip.ts'

exports.run = (client, message) => {
  const clips = clipsFromMessage(message);
  if (clips.length != 0) {
    for (const clip of clips) {
      const approve = new ButtonBuilder()
        .setCustomId('approve')
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success);

    }
  }
}
