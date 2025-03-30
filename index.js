const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.MESSAGE_CONTENT]
});

const config = require('./config.json');
client.config = config;
client.clips = new Collection();
client.mod_message = new Collection();
client.cross_roles = new Collection();
client.commands = new Collection();
client.clips_setup = new Collection();

// asked majed what cross-roles is ...
fs.readFile('./cross-roles.json', 'utf8', (e, data) => {
  if (e) {
    console.error(e);
    return;
  }

  const guilds = JSON.parse(data);

  for (const { guild_id, cross_channel_id, cross_roles } of guilds) {
    const roles = new Collection();
    for (const { id, name } of cross_roles) {
      roles.set(name, id);
    }
    client.cross_roles.set(guild_id, { cross_channel_id: cross_channel_id, cross_roles: roles });
  }
});

// also going to need to know what's in this file ...
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
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

// adds commands to a list from filename
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./commands/${file}`);

  console.log(`Attempting to load command ${commandName}`);
  client.commands.set(commandName, command);
}

client.login(token);
