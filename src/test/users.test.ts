import { expect, test } from "bun:test";
import { getUsers } from "../utils";

test("ทดสอบ function รับข้อมูล user", async (): Promise<void> => {
    const users: Users = await getUsers();
    console.log(users);
    expect(users).toBeArray();
});