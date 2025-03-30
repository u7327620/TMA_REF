const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});

const config = require('./config.json');
client.config = config;
client.clips = new Collection();
client.mod_message = new Collection();
client.commands = new Collection();
client.clips_setup = new Collection();

fs.readFile('./clips-setup.json', 'utf8', (e, data) => {
  if (e) {
    console.error(e);
    return;
  }

  const guilds = JSON.parse(data);

  for (const { guild_id, setup } of guilds)
    client.clips_setup.set(guild_id, setup);
});


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

// adds commands to a list from filename
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const command = require(`./commands/${file}`);

  console.log(`Attempting to load command ${command.data.name}`);
  client.commands.set(command.data.name, command);
}

client.login(config.token);
