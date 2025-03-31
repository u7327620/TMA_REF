import { Events } from 'discord.js';

export const name:Events.ClientReady = Events.ClientReady;
export const once:Boolean = true;
export function execute(client: { user: { tag: any; }; }) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}
