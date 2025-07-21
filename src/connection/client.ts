import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";

configDotenv();
const { MONGO_URI } = <Environment>Bun.env;

const client: MongoClient = new MongoClient(MONGO_URI);
export default client;