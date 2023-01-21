import { inject, injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { IMailProvider, IMailProviderProps } from "../IMailProvider";

const CALENDAR_FILE_NAME = 'invitation.ics'
const MAIL_FROM = `PrAktikA <${process.env.GENERAL_MAIL}>`

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

  async sendMail({
    to,
    subject,
    variables,
    path,
    calendarEvent,
  }: IMailProviderProps): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const mailOptions = {
      to,
      from: MAIL_FROM,
      subject,
      html: templateHTML,
    }

    if (calendarEvent) {
      const { content: calendarContent, method } = calendarEvent;
      const content = Buffer.from(calendarContent.toString());

      mailOptions['icalEvent'] = {
        filename: CALENDAR_FILE_NAME,
        method,
        content,
      }
    }

    const message = await this.client.sendMail(mailOptions);

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
