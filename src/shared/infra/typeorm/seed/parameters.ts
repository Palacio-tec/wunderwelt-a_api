import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

import createConnection from "../index";

async function create() {
  const connections = await createConnection();
  const connection = connections[0];

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'AvailableSignUp',
        'Define se a página de cadastro para usuários está (true) ou não (false) acessível para todos.',
        'true',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'TimeLimiteViewClass',
        'Informar o tempo mínimo(em horas) para a aula ser listada aos usuários.',
        '1',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'RefundTimeLimit',
        'Informar o tempo mínimo(em horas) para que o usuário tenha o reembolso das horas ao cancelar sua inscrição.',
        '24',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'ExpirationTime',
        'Define o tempo (em dias) que será adicionado a data de vencimento após a compra ou aplicação de um cupom.',
        '90',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'CancellationTimeout',
        'Informar com quantos dias de antecedência o aluno irá receber e-mail informando sobre a possibilidade de cancelamento da aula sem penalidade',
        '3',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'StudentlessPeriod',
        'Informar quantas horas antes os eventos sem alunos serão analizados e cancelados. Ou seja, caso o conteúdo desse parâmetro esteja preenchdi com 12, significa que os eventos que terão início daqui a 12 horas serão analizados e caso não tenham alunos serão cancelados',
        '12',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'ReminderEventEmail',
        'Informa quantas horas antes do início de uma aula o aluno receberá um e-mail de lembrete.',
        '1',
        'now()'
      )
    `
  );

  await connection.query(
    `INSERT INTO PARAMETERS(id, reference, description, value, created_at)
      values(
        '${uuidV4()}',
        'RefundPeriodReminder',
        'Informa quantos dias antes do início de uma aula o aluno receberá um e-mail avisando com relação ao período que pode realizar o cancelamento de uma aula e ter reembolso dos créditos.',
        '2',
        'now()'
      )
    `
  );

  await connection.close();
}

create().then(() => console.log("Parameters created"));
