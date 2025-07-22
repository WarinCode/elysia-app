import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { getEnv } from "./utils";
import userRoutes from "./routes/user.route";

const app = new Elysia()
  .use(cors({ origin: "*", methods: "*" }))
  .use(swagger())
  .get("/", () => "Hello World!")
  .use(userRoutes)
  .all("*", ({ status }) => status(400, "Not Found!"))
  .listen(getEnv("PORT"));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);