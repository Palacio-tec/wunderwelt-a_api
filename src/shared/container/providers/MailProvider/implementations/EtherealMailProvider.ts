import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { createCalendarEvent } from "@utils/createCalendarEvent";

import { IMailProvider } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const iCalendar = await createCalendarEvent(
      new Date(),
      new Date()
    )

    const message = await this.client.sendMail({
      to,
      from: "PrAktikA <info@wunderwelt-a.com.br>",
      subject,
      html: templateHTML,
      alternatives: [{
        contentType: 'text/calendar',
        content: new Buffer(iCalendar as unknown as string)
      }]
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
