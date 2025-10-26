import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { IMailProvider, IMailProviderProps } from "../IMailProvider";

const CALENDAR_FILE_NAME = "invitation.ics";
const MAIL_FROM = `PrAktikA <${process.env.GENERAL_MAIL}>`;

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
    template,
    base,
    calendarEvent,
    bcc,
  }: IMailProviderProps): Promise<void> {
    let templateContent: string;

    if (template && base) {
      templateContent = base.replace(
        '{{{body}}}',
        template
      );
    } else if (path) {
      templateContent = fs.readFileSync(path).toString("utf-8");
    } else {
      throw new Error("Either template or path must be provided");
    }

    const templateParse = handlebars.compile(templateContent);

    const templateHTML = templateParse(variables);
    const subjectTemplate = handlebars.compile(subject);
    const subjectCompiled = subjectTemplate(variables);

    const mailOptions = {
      to,
      from: MAIL_FROM,
      subject: subjectCompiled,
      html: templateHTML,
      bcc,
    };

    if (calendarEvent) {
      const { content: calendarContent, method } = calendarEvent;
      const content = Buffer.from(calendarContent.toString());

      mailOptions["icalEvent"] = {
        filename: CALENDAR_FILE_NAME,
        method,
        content,
      };
    }

    const message = await this.client.sendMail(mailOptions);

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
