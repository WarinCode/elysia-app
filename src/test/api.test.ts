import { describe, test, expect } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { App } from "../server";

describe("ทดสอบเส้น API Endpoints", (): void => {
    const app = treaty<App>("http://localhost:3000");

    test("GET /", async (): Promise<void> => {
        const { data } = await app.get();
        expect(data).toBeString();
    });

    test("GET /hello/:name", async (): Promise<void> => {
        const { data } = await app.hello({ name: "John Doe" }).get();
        expect(data).toBe("Hello John Doe");
    });

    test("GET /api/users", async (): Promise<void> => {
        const { data } = await app.api.users.get();
        expect(data).toBeArrayOfSize(1000);
    });

    test("GET /api/users/:id", async (): Promise<void> => {
        const { data } = await app.api.users({ id: 1 }).get();
        expect(data).toBeObject();
    });

    test("GET /api/users/limit/:limit", async (): Promise<void> => {
        const { data } = await app.api.users.limit({ limit: 5 }).get();
        expect(data).toBeArrayOfSize(5);
    });

    test("POST /api/users/create", async (): Promise<void> => {
        const newUser: Omit<User, "id"> = {
            firstname: "Jane",
            lastname: "Doe",
            email: "janedoe@gmail.com",
            gender: "Female",
            ipAddress: null
        };
        const { status } = await app.api.users.create.post(newUser);
        expect(status).toBe(201);
    });

    test("PUT /api/users/update/:id", async (): Promise<void> => {
        const updatedUser: Omit<User, "id"> = {
            firstname: "Jack",
            lastname: "Doe",
            email: "jackdoe@gmail.com",
            gender: "Male",
            ipAddress: null
        };
        const { data } = await app.api.users.update({ id: 1001 }).put(updatedUser);
        expect(data?.modifiedCount).toBe(1);
    });

    test("DELETE /api/users/remove/:id", async (): Promise<void> => {
        const { data } = await app.api.users.remove({ id: 1001 }).delete();
        expect(data?.deletedCount).toBe(1);
    });

    test("PATCH /api/users/update/:id/firstname", async (): Promise<void> => {
        const { data } = await app.api.users.update({ id: 1000 }).firstname.patch({ firstname: "John" });
        expect(data?.modifiedCount).toBe(1);
    });

    test("PATCH /api/users/update/:id/lastname", async (): Promise<void> => {
        const { data } = await app.api.users.update({ id: 1000 }).lastname.patch({ lastname: "Doe" });
        expect(data?.modifiedCount).toBe(1);
    });

    test("PATCH /api/users/update/:id/email", async (): Promise<void> => {
        const { data } = await app.api.users.update({ id: 1000 }).email.patch({ email: "johndoe@gmail.com" });
        expect(data?.modifiedCount).toBe(1);
    });

    test("PATCH /api/users/update/:id/gender", async (): Promise<void> => {
        const { data } = await app.api.users.update({ id: 1000 }).gender.patch({ gender: "Male" });
        expect(data?.modifiedCount).toBe(1);
    });

    test("PATCH /api/users/update/:id/ip", async (): Promise<void> => {
        const { data } = await app.api.users.update({ id: 1000 }).ip.patch({ ipAddress: null });
        expect(data?.modifiedCount).toBe(1);
    });
});