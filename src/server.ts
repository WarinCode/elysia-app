import { Elysia, t } from "elysia";
import { configDotenv } from "dotenv";
import client from "./connection/client";

configDotenv();
const { PORT } = <Environment>Bun.env;

const app = new Elysia()
  .get("/", () => "Hello World!")
  .group("/api", (app) => {
    return app.get("/users", async ({ status }) => {
      try {
        await client.connect();
        const db = client.db("db_34847");
        const collection = db.collection<User>("users");
        const users = await collection.find({}).toArray();
        return users;
      } catch (err: unknown) {
        return status(500);
      } finally {
        await client.close();
      }
    }).get("/users/:id", async ({ status, params: { id } }) => {
      try {
        await client.connect();
        const db = client.db("db_34847");
        const collection = db.collection<User>("users");
        const user = await collection.findOne({ id });
        return user;
      } catch (err: unknown) {
        return status(500);
      } finally {
        await client.close();
      }
    }, {
      params: t.Object({
        id: t.Number()
      })
    })
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);