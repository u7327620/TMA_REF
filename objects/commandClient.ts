import {Client, ClientOptions, Collection, Interaction, Message} from "discord.js"
import path from "node:path";
import fs from "node:fs";

export interface Command {
  name: String,
  description: String,
  execute: (input: Message|Interaction, ...args: string[]) => Promise<any>
}

export default class CommandClient extends Client {
  public commands: Collection<String, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.loadCommands()
  }

  private async loadCommands():Promise<String[]> {
    const loaded:String[] = [];
    const commandsPath = path.join(process.cwd(), "commands");
    await fs.promises.readdir(commandsPath, { recursive: true })
      .then((files: any[]) => {
        files = files.filter(file => file.endsWith(".js"));
        for (const file of files) {
          const commandPath = path.join(commandsPath, file);
          import(commandPath).then((command) => {
            loaded.push(command.data.name);
            this.commands.set(command.data.name, command);
            console.log(`loaded: ${command.data.name}`);
          })
        }
        console.log(this.commands.toJSON());
      })
      .catch(err => {
        console.log(err);
        return loaded;
      })
    return loaded;
  }
}