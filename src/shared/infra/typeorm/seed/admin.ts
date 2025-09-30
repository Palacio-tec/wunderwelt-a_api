import { randomUUID as uuidV4 } from "crypto";
import { hash } from "bcryptjs";

import createConnection from "../index";

async function create() {
  const connections = await createConnection();
  const connection = connections[0];

  const id = uuidV4();
  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, username, email, password, is_admin, created_at)
      values('${id}', 'admin', 'admin', 'yurifpalacio@gmail.com', '${password}', true, 'now()')
    `
  );

  connections.map((conn) => conn.close());
}

create().then(() => console.log("User admin created"));
