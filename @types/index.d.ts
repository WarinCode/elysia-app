declare type Gender = "Male" | "Female" | "Genderfluid" | "Non-binary" | "Genderqueer" | "Bigender" | "Polygender" | "Agender";

declare interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: Gender;
    ipAddress: string;
}

declare type Users = User[];

declare interface Environment extends Bun.Env, NodeJS.ProcessEnv, ImportMetaEnv {
    readonly PORT: string;
    readonly MONGO_URI: string;
}