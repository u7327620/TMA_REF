import {Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from 'node:fs';
// @ts-ignore
import config from './config.json' with { type: "json"};

export const client = new Client({
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
  console.log(`Path: ${filePath}`)
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
/*const commandsPath = path.join(__dirname, "commands");
fs.promises.readdir(commandsPath, { recursive: true })
  .then(files => {
    files = files.filter(file => file.endsWith(".js") || file.endsWith(".cjs"));
    for (const file of files) {
      const commandPath = path.join(commandsPath, file);
      const command = require(commandPath);
      console.log(`Loading command: ${command.data.name}`);
      client.commands.set(command.data.name, command);
    }
  })
    .catch(err => {
    console.log(err);
  })*/

client.login(config.token);
