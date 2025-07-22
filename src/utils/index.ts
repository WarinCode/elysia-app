import { BunFile } from "bun";
import path from "path";
import { configDotenv } from "dotenv";

export const getDataPath = (): string => {
    return path.join(import.meta.dir.replace("\\utils", ""), "data", "users.json");
}

export const getUsers = async (path: string = getDataPath()): Promise<Users> => {
    const file: BunFile = Bun.file(path);
    const data: Users = await file.json();
    return data;
}

export const getEnv = (key: Keys): string => {
    configDotenv();
    return Bun.env[key] as string;
}