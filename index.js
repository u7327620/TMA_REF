const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});

const config = require('./config.json');
client.config = config;
client.commands = new Collection();

// binds events from filename
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// adds commands to a collection from filename
fs.promises.readdir("./commands", { recursive: true })
  .then(files => {
    files = files.filter(file => file.endsWith(".js"));
    for (const file of files) {
      const command = require(`./commands/${file}`);
      console.log(`Loading command: ${command.data.name}`);
      client.commands.set(command.data.name, command);
    }
  })
  .catch(err => {
    console.log(err);
  })

client.login(config.token);
