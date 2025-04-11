import {Client, ClientOptions, Collection, Interaction} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import config from "../config.json" with { type: "json" };

export interface Command {
  name: String,
  description: String,
  execute: (input: Interaction, ...args: string[]) => Promise<any>;
}

export type SheetData = {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * Attaches application commands to {@link Client}.
 *
 * Retrieves and loads commands (recursively) via file-name from ./commands.
 */
export default class CommandClient extends Client {
  public commands: Collection<String, Command>;
  private googleKey: string;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.googleKey = config.googleKey;
    this.loadCommands();
  }

  /**
   * Fetches and returns data from public Google spreadsheet.
   *
   * @param sheetId Google spreadsheet id
   * @param range Data range to retrieve
   * @return {@link SheetData} or null on error
   *
   * @example this.getToribashSheetData("1SVzVUSdprXhI9_gtq-u4dsAZnp-ptt5B4yodxIAnmes", "0mino!A1:B35")
   */
  public getToribashSheetData(sheetId:string, range: string):SheetData | null {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${this.googleKey}`)
      .then((res:Response):Promise<any> => res.json())
      .then((data) => {
        console.log(data);
        return {
          range: data.range,
          majorDimension: data.majorDimension,
          values: data.values
        };
      })
      .catch((err) => console.error("Error fetching sheet", err));
    return null;
}

  private loadCommands():String[] {
    const loaded:String[] = [];
    const commandsPath = path.join(process.cwd(), "commands");
    fs.promises.readdir(commandsPath, { recursive: true })
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