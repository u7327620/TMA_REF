import { GatewayIntentBits } from "discord.js";
import CommandClient from "./objects/commandClient.js"
import path from "node:path";
import fs from 'node:fs';
// @ts-ignore
import config from './config.json' with { type: "json"};

export const client = new CommandClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// binds events from filename
const eventsPath = path.join(process.cwd(), "events");
const events = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
for (const file of events) {
  const filePath = path.join(eventsPath, file);
  import(filePath).then((event) => {
    console.log(`Loading event: ${event.name}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  })
}

// adds commands to a collection from filename
/**/

client.login(config.token);
