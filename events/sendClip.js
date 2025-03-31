import { clipsApproval, clipsFromMessage } from '../objects/toribash-clip.ts'

exports.run = (client, message) => {
  const clips = clipsFromMessage(message);
  if (clips.length != 0) {
    clips.forEach((clip) => { clipsApproval(client, clip) });
  }
}
