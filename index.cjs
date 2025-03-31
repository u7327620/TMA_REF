const { Client, GatewayIntentBits, Collection } = require("discord.js");
const path = require("node:path");
const fs = require('node:fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});

const config = require('./config.json');
client.config = config;
client.commands = new Collection();

// binds events from filename
const eventsPath = path.join(__dirname, "events");
const events = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
for (const file of events) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  console.log(`Loading event: ${event.name}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// adds commands to a collection from filename
const commandsPath = path.join(__dirname, "commands");
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
  })

client.login(config.token);
