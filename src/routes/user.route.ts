import { Elysia, t, InternalServerError } from "elysia";
import { Db, Collection, InsertOneResult, UpdateResult, DeleteResult } from "mongodb";
import { getEnv } from "../utils";
import client from "../connection/client";

const userRoutes = new Elysia()
    .decorate("dbName", getEnv("DATABASE_NAME"))
    .decorate("collectionName", getEnv("COLLECTION_NAME"))
    .group("/api", (app) => {
        return app.get("/users", async ({ status, dbName, collectionName }) => {
            try {
                await client.connect();
                const db: Db = client.db(dbName);
                const collection: Collection<User> = db.collection<User>(collectionName);
                const users: Users = await collection.find({}).toArray();
                return status(200, users);
            } catch (err: unknown) {
                return status(500);
            } finally {
                await client.close();
            }
        }).get("/users/:id", async ({ status, params: { id }, dbName, collectionName }) => {
            try {
                await client.connect();
                const db: Db = client.db(dbName);
                const collection: Collection<User> = db.collection<User>(collectionName);
                const user: User | null = await collection.findOne({ id });

                if (user === null || !("id" in user)) {
                    throw new InternalServerError("User not found!");
                }

                return status(200, user);
            } catch (err: unknown) {
                if (err instanceof InternalServerError) {
                    return status(500, err.message);
                }

                return status(500);
            } finally {
                await client.close();
            }
        }, {
            params: t.Object({
                id: t.Number({ minimum: 1, maximum: 10000 })
            })
        }).get("/users/limit/:limit", async ({ status, params: { limit }, collectionName, dbName }) => {
            try {
                await client.connect();
                const db: Db = client.db(dbName);
                const collection: Collection<User> = db.collection<User>(collectionName);
                const users: Users = await collection.find({}).limit(limit).toArray();
                return status(200, users);
            } catch (err: unknown) {
                return status(500);
            }
        }, {
            params: t.Object({
                limit: t.Number({ minimum: 1, maximum: 10000 })
            })
        }).post("/users/create", async ({ status, body, dbName, collectionName }) => {
            try {
                await client.connect();
                const db: Db = client.db(dbName);
                const collection: Collection<User> = db.collection<User>(collectionName);
                const users: Users = await collection.find({}).toArray();

                const id: number = users.length + 1;
                const data: User = { id, ...body };

                const result: InsertOneResult<User> = await collection.insertOne(data);
                return status(201, result);
            } catch (err: unknown) {
                return status(500);
            }
        }, {
            body: t.Object({
                firstname: t.String({ minLength: 3, maxLength: 20 }),
                lastname: t.String({ minLength: 3, maxLength: 20 }),
                email: t.String({ minLength: 5, maxLength: 50, format: "email" }),
                gender: t.Union([
                    t.Null(),
                    t.Literal('Male'),
                    t.Literal("Female"),
                    t.Literal("Genderfluid"),
                    t.Literal("Non-binary"),
                    t.Literal("Genderqueer"),
                    t.Literal("Bigender"),
                    t.Literal("Polygender"),
                    t.Literal("Agender")
                ]),
                ipAddress: t.Union([t.String({ format: "ipv4" }), t.Null()])
            })
        }).put("/users/update/:id", async ({ status, body, params: { id }, collectionName, dbName }) => {
            try {
                await client.connect();
                const db: Db = client.db(dbName);
                const collection: Collection<User> = db.collection<User>(collectionName);
                const result: UpdateResult<User> = await collection.updateOne({ id }, { $set: body });
                return status(200, result);
            } catch (err: unknown) {
                return status(500);
            } finally {
                await client.close();
            }
        }, {
            params: t.Object({
                id: t.Number({ minimum: 1, maximum: 10000 })
            }),
            body: t.Object({
                firstname: t.String({ minLength: 3, maxLength: 20 }),
                lastname: t.String({ minLength: 3, maxLength: 20 }),
                email: t.String({ minLength: 5, maxLength: 50, format: "email" }),
                gender: t.Union([
                    t.Null(),
                    t.Literal('Male'),
                    t.Literal("Female"),
                    t.Literal("Genderfluid"),
                    t.Literal("Non-binary"),
                    t.Literal("Genderqueer"),
                    t.Literal("Bigender"),
                    t.Literal("Polygender"),
                    t.Literal("Agender")
                ]),
                ipAddress: t.Union([t.String({ format: "ipv4" }), t.Null()])
            })
        })
            .delete("/users/delete/:id", async ({ status, dbName, collectionName, params: { id } }) => {
                try {
                    await client.connect();
                    const db: Db = client.db(dbName);
                    const collection: Collection<User> = db.collection<User>(collectionName);
                    const result: DeleteResult = await collection.deleteOne({ id });
                    return status(200, result);
                } catch (err: unknown) {
                    return status(500);
                } finally {
                    await client.close();
                }
            }, {
                params: t.Object({
                    id: t.Number({ minimum: 1, maximum: 10000 })
                })
            })
    })

export default userRoutes;