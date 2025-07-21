import { BunFile } from "bun";

export const getDataPath = (): string => {
    return import.meta.dir.replace("\\utils", "\\data\\users.json");
}

export const getUsers = async (path: string = getDataPath()): Promise<Users> => {
    const file: BunFile = Bun.file(path);
    const data: Users = await file.json();
    return data;
}