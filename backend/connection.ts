import { DbStorage } from "./models/engine/db_storage";
import { error } from "console";
import dotenv from "dotenv";

dotenv.config()

const db: string = process.env.DB || ""
const dnname: string = process.env.DBNAME || ""
const host: string = process.env.HOST || ""
const user: string = process.env.DBUSER || ""
const user_pswd: string = process.env.USERPWD || ""

const dbconn: DbStorage = new DbStorage()
console.log(`mongodb://${user}:${user_pswd}@${host}/${dnname}`)
dbconn.connectionFactory(`mongodb://${user}:${user_pswd}@${host}:27017/${dnname}`)
export default dbconn