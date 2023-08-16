import { load } from "https://deno.land/std@0.198.0/dotenv/mod.ts";
import { Database, MySQLConnector } from  "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";

const env = await load();

// Das ist die Verbindung zur Datenbank
// Die Datenbank ist auf dem Server von Manitu
const connection = new MySQLConnector({
  host: env["HOST"],
  username: env["USERNAME"],
  password: env["PASSWORD"],
  database: env["DATABASE"],
  port: Number(env["PORT"])
});

// Die Datenbank wird exportiert, damit sie in anderen Dateien verwendet werden kann
export const db = new Database(connection);