import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import { getEnv } from "./utils";
import userRoutes from "./routes/user.route";

const app = new Elysia()
  .use(cors({ origin: "*", methods: "*" }))
  .use(swagger())
  .use(logger({ mode: "live", withTimestamp: true }))
  .get("/", () => "Hello World!")
  .get("/hello/:name", ({ params: { name }}) => `Hello ${name}`)
  .use(userRoutes)
  .all("*", ({ status }) => status(404, "Not Found!"))
  .listen(getEnv("PORT"));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;