import { MongoClient } from "mongodb";
import { getEnv } from "../utils";

const client: MongoClient = new MongoClient(getEnv("MONGO_URI"));
export default client;