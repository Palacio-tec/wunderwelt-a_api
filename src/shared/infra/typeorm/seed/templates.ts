import { randomUUID as uuidV4 } from "crypto";

import createConnection from "../index";

async function create() {
  const connections = await createConnection();
  const connection = connections[0];

  try {
    console.log(`📧 Criando templates...`);
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

    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Template base', '<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div style="width: 100vw; max-width: 100%; margin: 0 auto; background-color: #1e2f50; margin-bottom: 1rem; text-align: center;">
      <img style="width: 100%; max-width: 220px;" src="https://praktika.wunderwelt-a.com.br/static/media/praktika-branco.6e03be72.png"/>
    </div>

    <div style="color: #1e2f50;">
      {{{body}}}

      <br />

      <p style="color: #1e2f50;">Equipe | <strong>PrAktikA - Wunderwelt-A</strong></p>

      <div style="width: 100%; height: 2px; background-color: #1e2f50;" />

      <footer style="display: flex; justify-content: center; padding-top: 1rem;">
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.instagram.com/wunderwelt.a/">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        </a>
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.facebook.com/WunderweltA">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.youtube.com/channel/UCTX3oxKEBP2LhEsgP6BtPmQ">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </footer>

      <p style="font-size: 14px; color: #687173;">
        Não responda a esta mensagem. Este e-mail foi enviado por um sistema automático que não processa respostas.
      </p>
    </div>
  </body>
</html>', 1, 'base', NULL, '${userId}', true, now(), now())`);

    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Template newsletter base', '<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div style="width: 100vw; max-width: 600px; margin: 0 auto; background-color: #1e2f50; margin-bottom: 1rem; text-align: center;">
      <img style="width: 100%; max-width: 220px;" src="https://praktika.wunderwelt-a.com.br/static/media/praktika-branco.6e03be72.png"/>
    </div>
    <div style="width: 100vw; max-width: 570px; margin: 0 auto; font-size: 18px; font-family: Arial, Helvetica, sans-serif; background-color: white; color: #1e2f50;">
      {{{body}}}

      <div style="max-width: 550px; margin: 0 auto;">
        {{#each mailData}}
          <div id={{id}} style="justify-content: space-between; width: fit-content; padding: 10px;">
              <a style="align-items: flex-start; color: #1e2f50; margin: 10px 0 0 0; text-decoration: none; font-weight: bold;" href="https://praktika.wunderwelt-a.com.br">
                ✓ <span style="font-size: larger; text-align: left; font-weight: bold; color: #1e2f50; margin: 10px 0 0 0;"> {{title}}</span>
              </a>
              <br />
              <span style="padding-left: 1rem; font-size: smaller;">{{date}} (horário de Brasília)</span>
              <div style="padding-left: 1rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; line-height: 18px; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                  {{{description}}}
              </div>
          </div>
        {{/each}}
      </div>

      <br />

      <p style="color: #1e2f50;">Equipe | <strong>PrAktikA - Wunderwelt-A</strong></p>

      <div style="width: 100%; height: 2px; background-color: #1e2f50;" />

      <footer style="display: flex; justify-content: center; padding-top: 1rem;">
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.instagram.com/wunderwelt.a/">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </a>
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.facebook.com/WunderweltA">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </a>
        <a style="margin-inline: 0.5rem; text-decoration: none; font-weight: bold; color: inherit;" href="https://www.youtube.com/channel/UCTX3oxKEBP2LhEsgP6BtPmQ">
          <svg style="width: 1.5rem; fill: black;" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </footer>

      <p style="font-size: 14px; color: #687173;">
        Não responda a esta mensagem. Este e-mail foi enviado por um sistema automático que não processa respostas.
      </p>

      <p style="font-size: 13px; color: #464d4e; text-align: center;">
         <a style="align-items: flex-start; text-decoration: none; font-weight: bold; color: inherit;" href="https://praktika.wunderwelt-a.com.br/unsubscribe/news?code={{user_id}}">
            Remover inscrição
          </a>
      </p>
    </div>
  </body>
</html>', 1, 'base-newsletter', NULL, '${userId}', true, now(), now())`);

    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Teste Apenas Texto', '<div style="width: 100vw; max-width: 1000px; font-size: 18px; font-family: Arial, Helvetica, sans-serif; background-color: white; color: #1e2f50;">
  <span style="margin: 10px 0; display: block;">Olá, {{name}}</span>

  <br />

  <span style="margin: 10px 0; display: block;">E-mail apenas para verificar se houve o recebimento</span>
  
  <br />
</div>', 1, 'teste_only_text', 'base', '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Teste Sem Link', '<div style="width: 100vw; max-width: 1000px; font-size: 18px; font-family: Arial, Helvetica, sans-serif; background-color: white; color: #1e2f50;">
  <span style="margin: 10px 0; display: block;">Olá, {{name}}</span>

  <br />

  <span style="margin: 10px 0; display: block;">Gostaríamos de lembrá-lo(a) que a aula "{{title}}" vai começar em aproximadamente {{time}}h.</span>
  <br />
  <span style="margin: 10px 0; display: block;">Acesse a sala virtual utilizando as informações abaixo:</span>
  <br />

  <br />
  
  <p style="margin: 10px 0;">Bons Estudos!</p>

  <br />
</div>', 1, 'teste_no_link', 'base', '${userId}', true, now(), now())`);
    
    // ...existing code... (todos os outros templates)
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'E-mail com sugestão em lista de espera', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá,</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">O aluno {{student}} entrou na lista de espera para a aula "{{title}}", que acontecerá no dia {{day}} às {{start_hour}}, e colocou a seguinte sugestão:</span></p>
<p style="margin-left:0px;"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">"{{suggestion}}"</span></p>
', 1, 'mail_with_suggestion', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Esqueci minha senha', '<p>Oi, {{name}}</p>
<p></p>
<p>Você solicitou a recuperação de senha.<br>Para realizar a troca, <a href="{{link}}" target="_self">clique aqui</a>.</p>
<p></p>
<p>Caso não tenha sido você que solicitou a alteração da senha, basta ignorar este e-mail.</p>
', 1, 'forgot_password', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Aula cancelada - Aluno', '<p>Olá, {{name}} <br>{{mailMessage}}</p>
<p><br><a href="https://praktika.wunderwelt-a.com.br" target="_self"><strong>Veja a programação</strong></a> de outras aulas da PrAktikA.</p>
', 1, 'cancel_event', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Aula cancelada - Professor', '<p>Olá, {{name}}<br>{{mailMessage}}</p>
', 1, 'cancel_event_teacher', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Criação de usuário', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Oi, {{name}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Você foi cadastrado(a) na plataforma PrAktikA, da Wunderwelt-A.</span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Para acessá-la, utilize o usuário e senha abaixo.</span></p>
<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Usuário: <strong>{{username}}</strong></span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Senha: <strong>{{password}}</strong></span> <a href="https://praktika.wunderwelt-a.com.br" target="_self"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Clique aqui</span></a><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"> e acesse a plataforma.</span></p>
', 1, 'create_user', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Lembrete créditos irão vencer', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, <strong>{{name}}</strong></span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Gostaríamos de lembrar que você possui {{amount}} crédito(s) que vence daqui {{days}} dias.</span><br><br><a href="https://praktika.wunderwelt-a.com.br/" target="_self"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Acesse a plataforma</span></a><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"> para verificar a data de vencimento do(s) crédito(s) e encontre uma aula que melhor se enquadre as suas necessidades.</span></p>
', 1, 'credit_will_expired', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Excluir uma aula', '<p>Olá, {{name}}<br>{{mailMessage}}</p>
', 1, 'delete_event', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Envio de créditos de presente', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}<br>{{#if plural}}<br>Você acabou de ganhar {{credit}} créditos de presente!<br>{{else}}<br>Você acabou de ganhar {{credit}} crédito de presente!<br>{{/if}}</span></p>
', 1, 'send_gift', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Alteração de Evento - Professor', '<p>Prof. {{name}},<br>A aula "{{title}}" foi alterada para o dia {{dateTime}} (horário de Brasília) com duração de {{duration}} minutos.</p>
', 1, 'teacher_event_change', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Aula irá começar lista de alunos', '<p>Olá, {{name}} <br>Segue a lista dos alunos matriculados na aula "{{title}}", que acontecerá hoje às {{time}} (horário de Brasilia). <br>Para acessar a sala virtual utilize as informações abaixo:<br>{{{link}}}<br></p>
<p>&lt;table&gt;</p>
<p>&lt;tr&gt;</p>
<p>&lt;th&gt;Aluno&lt;/th&gt;</p>
<p>&lt;th&gt;Assunto&lt;/th&gt;</p>
<p>&lt;/tr&gt;</p>
<p>{{#each schedules}}</p>
<p>&lt;tr&gt;</p>
<p>&lt;td&gt;{{user.name}}&lt;/th&gt;</p>
<p>&lt;td&gt;{{subject}}&lt;/th&gt;</p>
<p>&lt;/tr&gt;</p>
<p>{{/each}}</p>
<p>&lt;/table&gt;</p>
', 1, 'event_will_start', NULL, '${userId}', false, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Aula disponível e-mail para lista de espera', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Foi aberta uma vaga para a aula "{{title}}", que acontecerá no dia {{day}}.</span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Corra e garanta a sua inscrição!</span><br><a href="https://praktika.wunderwelt-a.com.br/classes-list" target="_self"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"><strong>Clique aqui</strong></span></a><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"> para acessar a plataforma e se inscrever.</span></p>
', 1, 'queue_available_event', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Estudante removido da aula', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}<br>{{#if hasMailDescription}}<br>{{mailDescription}}<br>{{else}}<br>Gostaríamos de informar que os administradores identificaram que a aula "{{title}}" pode não ser adequada ao seu nível atual.</span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Com o objetivo de garantir que você sempre desfrute da melhor experiência de aprendizado possível, tomamos a decisão de cancelar sua inscrição para esta aula específica.<br>{{/if}}<br>No entanto, queremos assegurar que você não precise se preocupar. Seus créditos foram devidamente reembolsados, e nossa equipe está à disposição para esclarecer quaisquer dúvidas que possam surgir.</span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Agradecemos pela sua compreensão e permanecemos à disposição para auxiliá-lo em seu percurso educacional.</span></p>
', 1, 'student_removed', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Aula criada - Professor', '<p>Prof. {{name}},</p>
<p></p>
<p>Realizamos a inclusão da aula "{{title}}" para o dia {{dateTime}} (horário de Brasília) com duração de {{duration}} minutos.</p>
', 1, 'teacher_event_created', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Newsletter', '<p><strong>Liebe KursteilnehmerInnen</strong><br>{{#if hasPromotion}}<br><span style="background-color: rgb(247,247,247);"><strong>{{message}}<br></strong></span>{{#with coupon}}<br><span style="color: white;background-color: rgb(79,146,221);font-size: 1.2rem;"><strong>{{code}}</strong></span><br>{{/with}}<br>{{/if}}<br>Sua Newsletter Semanal da PrAktikA está aqui!<br>Confira abaixo a lista de aulas de temas lançadas nesta semana.As aulas de Estudo Livre e Privatstunde podem ser consultadas diretamente na PrAktikA.</p>
', 1, 'newsletter', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Prévia da aula', '<p>Olá, {{name}}<br>Segue prévia da lista dos alunos matriculados na aula "{{title}}", que acontecerá {{datetime}} (horário de Brasilia).<br>{{#each schedules}}<br>{{/each}}<br>Aluno Assunto  {{user.name}}<br>{{subject}}</p>
', 1, 'event_preview', NULL, '${userId}', false, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Lembrete de Reembolso', '<p>Olá, {{name}}</p>
<p>Gostaríamos de lembrá-lo(a) que o período de reembolso relativo ao cancelamento da aula <strong>"{{title}}"</strong> que ocorrerá no dia <strong>{{eventDate}}</strong> está próximo de acabar.</p>
<p>Caso precise realizar o cancelamento, <a href="https://praktika.wunderwelt-a.com.br" target="_self"><strong>ACESSE A PLATAFORMA DA PRAKTIKA E CANCELE A AULA</strong></a>, assim você garantirá seus créditos de volta.<br><strong>Reforçamos que o período para cancelamento com reembolso é em até {{refundTimeLimit}} horas antes do início da aula.</strong></p>
', 1, 'refound_reminder', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Remoção de Crédito', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}<br>{{#if plural}}<br>Foram removidos {{credit}} créditos do seu saldo.<br>{{else}}<br>Foi removido {{credit}} do seu saldo.<br>{{/if}}<br></span></p>
<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Esta ação foi realizada pela equipe administrativa da PrAktikA.</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Para maiores informações fique a vontade para entrar em contato conosco por meio do nosso e-mail praktika@wunderwelt-a.com.br</span></p>
', 1, 'remove_credit', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Suporte FAQ', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">O aluno {{user.name}} ({{user.email}}) está com a seguinte dúvida:</span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{{description}}}</span></p>
', 1, 'support', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Inscrição para aula', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Você realizou a inscrição para a aula "{{title}}", que acontecerá no dia {{day}} às {{start_hour}} (horário de Brasília).</span></p>
<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{#if hasInstruction}}</span></p>
<p style="margin-left:0px;"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"><strong>Para se preparar para a aula é importante seguir a(s) instrução(ões) abaixo:</strong></span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{{instruction}}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{/if}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">O link para a sala virtual será enviado por e-mail, 2h antes do inicio da aula.</span></p>
', 1, 'create_schedule', NULL, '${userId}', true, now(), now())`);
    
    await connection.query(
      `INSERT INTO public.templates (id, title, body, "version", "template", layout, user_id, is_active, created_at, updated_at)
     VALUES ('${uuidV4()}', 'Lembrete aula irá começar - Aluno', '<p><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Olá, {{name}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Gostaríamos de lembrá-lo(a) que a aula "{{title}}" vai começar às {{time}}h.</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Acesse a sala virtual utilizando as informações abaixo:</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{{link}}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{#if hasInstruction}}</span></p>
<p style="margin-left:0px;"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;"><strong>Para se preparar para a aula é importante seguir a(s) instrução(ões) abaixo:</strong></span> <span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{{instruction}}}</span><br><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">{{/if}}</span></p>
<p style="margin-left:0px;"><span style="color: rgb(30,47,80);background-color: white;font-size: 18px;font-family: Arial, Helvetica, sans-serif;">Bons Estudos!</span>&nbsp;</p>
', 1, 'event_reminder', NULL, '${userId}', true, now(), now())`);

    console.log(`✅ Templates criados com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao criar templates:", error);
    throw error;
  } finally {
    await Promise.all(connections.map((conn) => conn.close()));
  }
}

create()
  .then(() => console.log("Templates seed completed"))
  .finally(() => process.exit(0));