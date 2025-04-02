import {Client, ClientOptions, Collection, Interaction} from "discord.js"
import path from "node:path";
import fs from "node:fs";
import {authenticate} from "@google-cloud/local-auth";
import {google} from "googleapis";
import { OAuth2Client } from 'google-auth-library'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export interface Command {
  name: String,
  description: String,
  execute: (input: Interaction, ...args: string[]) => Promise<any>
}

export default class CommandClient extends Client {
  public commands: Collection<String, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.googleAuth().then(this.loadCommands);
  }

  private async googleAuth():Promise<OAuth2Client> {
    async function saveCredentials(client: OAuth2Client):Promise<void> {
      const content:string = fs.readFileSync(CREDENTIALS_PATH).toString();
      const keys = JSON.parse(content);
      const key = keys.installed || keys.web;
      const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      });
      fs.writeFileSync(TOKEN_PATH, payload);
    }
    async function loadSavedCredentialsIfExist():Promise<OAuth2Client | null> {
      try {
        const content = fs.readFileSync(TOKEN_PATH).toString();
        const credentials = JSON.parse(content);
        return (google.auth.fromJSON(credentials) as OAuth2Client);
      } catch (err) {
        console.log("Can't log from credentials");
        return null;
      }
    }

    console.log("Authing Google");
    let client:OAuth2Client | null = await loadSavedCredentialsIfExist();
    if(client) return client;

    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    })

    console.log("Finished auth");
    if (client.credentials){
      console.log("Saving authed credentials")
      await saveCredentials(client);
    }
    console.log("Returning form auth");
    return client;
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