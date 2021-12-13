import { app } from "@shared/infra/http/app";
import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import request from "supertest";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, username, password, is_admin, created_at)
        values('${id}', 'admin', 'admin', '${password}', true, 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/users")
      .send({
        name: "Seth Walker",
        email: "koijwi@asosi.yt",
        username: "sethwalker",
        password: "teste",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
