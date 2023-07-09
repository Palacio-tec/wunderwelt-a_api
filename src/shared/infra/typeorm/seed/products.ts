import { randomUUID as uuidV4 } from 'crypto'

import createConnection from "../index";

async function create() {
  const connections = await createConnection();
  const connection = connections[0];

  await connection.query(
    `INSERT INTO PRODUCTS(id, name, description, value, amount, created_at)
      values(
        '${uuidV4()}',
        'Pontual',
        'Recomendado para o aluno que deseja conhecer nossa metodologia sem a necessidade de um investimento elevado, ou que deseje participar de uma aula em específico',
        60,
        6,
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PRODUCTS(id, name, description, value, amount, created_at)
      values(
        '${uuidV4()}',
        'Buscando Melhoria',
        'Ideal para quem está buscando se aperfeiçoar em um assunto ou pilar específico e deseja estar mais próximo e comprometido com esse objetivo',
        110,
        12,
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PRODUCTS(id, name, description, value, amount, created_at)
      values(
        '${uuidV4()}',
        'Foco na Fluência',
        'Em busca de atingir a fluencia e ter uma evolução constate com foco e determinação e buscando a tão sonhada fluência',
        210,
        24,
        'now()'
      )
    `
  );

  await connection.close();
}

create().then(() => console.log("Products created"));
