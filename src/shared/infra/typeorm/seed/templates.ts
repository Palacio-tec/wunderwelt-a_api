import { randomUUID as uuidV4 } from "crypto";
import * as fs from "fs";
import * as path from "path";

import createConnection from "../index";

async function create() {
  const connections = await createConnection();
  const connection = connections[0];

  try {
    console.log(`📧 Criando templates baseados em arquivos .hbs...`);
    // Buscar um usuário admin para associar aos templates
    const adminUser = await connection.query(
      `SELECT id FROM users WHERE is_admin = true LIMIT 1`
    );

    if (!adminUser || adminUser.length === 0) {
      console.log(
        "❌ Nenhum usuário admin encontrado. Execute primeiro o seed:admin"
      );
      return;
    }

    const userId = adminUser[0].id;

    // Lista de todos os templates .hbs encontrados
    const templates = [
      // Accounts module
      {
        file: "src/modules/accounts/views/emails/sendGift.hbs",
        name: "Envio de Presente",
        key: "send_gift",
      },
      {
        file: "src/modules/accounts/views/emails/removeCredit.hbs",
        name: "Remoção de Crédito",
        key: "remove_credit",
      },
      {
        file: "src/modules/accounts/views/emails/forgotPassword.hbs",
        name: "Esqueci Minha Senha",
        key: "forgot_password",
      },
      {
        file: "src/modules/accounts/views/emails/creditWillExpired.hbs",
        name: "Crédito Vai Expirar",
        key: "credit_will_expired",
      },
      {
        file: "src/modules/accounts/views/emails/createUser.hbs",
        name: "Criar Usuário",
        key: "create_user",
      },

      // Events module
      {
        file: "src/modules/events/views/emails/cancelEvent.hbs",
        name: "Cancelar Evento",
        key: "cancel_event",
      },
      {
        file: "src/modules/events/views/emails/cancelEventTeacher.hbs",
        name: "Cancelar Evento - Professor",
        key: "cancel_event_teacher",
      },
      {
        file: "src/modules/events/views/emails/testeOnlyText.hbs",
        name: "Teste Apenas Texto",
        key: "teste_only_text",
      },
      {
        file: "src/modules/events/views/emails/testeNoLink.hbs",
        name: "Teste Sem Link",
        key: "teste_no_link",
      },
      {
        file: "src/modules/events/views/emails/teacherEventCreated.hbs",
        name: "Evento Criado - Professor",
        key: "teacher_event_created",
      },
      {
        file: "src/modules/events/views/emails/teacherEventChange.hbs",
        name: "Alteração de Evento - Professor",
        key: "teacher_event_change",
      },
      {
        file: "src/modules/events/views/emails/refoundReminder.hbs",
        name: "Lembrete de Reembolso",
        key: "refound_reminder",
      },
      {
        file: "src/modules/events/views/emails/newsletter.hbs",
        name: "Newsletter",
        key: "newsletter",
      },
      {
        file: "src/modules/events/views/emails/eventWillStart.hbs",
        name: "Evento Vai Começar",
        key: "event_will_start",
      },
      {
        file: "src/modules/events/views/emails/eventReminder.hbs",
        name: "Lembrete de Evento",
        key: "event_reminder",
      },
      {
        file: "src/modules/events/views/emails/eventPreview.hbs",
        name: "Prévia do Evento",
        key: "event_preview",
      },
      {
        file: "src/modules/events/views/emails/deleteEvent.hbs",
        name: "Deletar Evento",
        key: "delete_event",
      },

      // Schedules module
      {
        file: "src/modules/schedules/views/emails/studentRemoved.hbs",
        name: "Estudante Removido",
        key: "student_removed",
      },
      {
        file: "src/modules/schedules/views/emails/createSchedule.hbs",
        name: "Criar Agendamento",
        key: "create_schedule",
      },

      // Other modules
      {
        file: "src/modules/fqas/views/emails/support.hbs",
        name: "Suporte FAQ",
        key: "support",
      },
      {
        file: "src/modules/queues/views/emails/mailWithSuggestion.hbs",
        name: "E-mail com Sugestão",
        key: "mail_with_suggestion",
      },
      {
        file: "src/modules/queues/views/emails/queueAvailableEvent.hbs",
        name: "Evento Disponível na Fila",
        key: "queue_available_event",
      },
    ];

    for (const template of templates) {
      const filePath = path.resolve(process.cwd(), template.file);

      let content = "Template não encontrado";
      try {
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, "utf-8");
          // Escapar aspas simples para o SQL
          content = content.replace(/'/g, "''");
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao ler arquivo ${template.file}`);
      }

      await connection.query(
        `INSERT INTO templates(id, title, body, version, template, user_id, is_active, created_at, updated_at)
          values(
            '${uuidV4()}',
            '${template.name}',
            '${content}',
            1,
            '${template.key}',
            '${userId}',
            true,
            now(),
            now()
          )
        `
      );
    }

    console.log(`✅ ${templates.length} templates criados com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao criar templates:", error);
    throw error;
  } finally {
    // Fechar todas as conexões
    await Promise.all(connections.map((conn) => conn.close()));
  }
}

create()
  .then(() => console.log("Templates seed completed"))
  .finally(() => process.exit(0));
