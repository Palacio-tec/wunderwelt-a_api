import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider, IMailProviderProps } from "../IMailProvider";

const CALENDAR_FILE_NAME = "invitation.ics";
const MAIL_FROM = `PrAktikA <${process.env.GENERAL_MAIL}>`;
const SES_API_VERSION = "2010-12-01";

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: SES_API_VERSION,
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail({
    to,
    subject,
    variables,
    path,
    template,
    calendarEvent,
    bcc,
  }: IMailProviderProps): Promise<void> {
    let templateContent: string;

    if (template) {
      templateContent = template;
    } else if (path) {
      templateContent = fs.readFileSync(path).toString("utf-8");
    } else {
      throw new Error("Either template or path must be provided");
    }

    const templateParse = handlebars.compile(templateContent);

    const templateHTML = templateParse(variables);

    const mailOptions = {
      to: process.env.RECIPIENT || to,
      from: MAIL_FROM,
      subject,
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

    try {
      await this.client.sendMail(mailOptions);
    } catch (error) {
      console.log(`${new Date()} - ERRO NO ENVIO DO EMAIL`);
      console.log(error);
      console.log("--------------------------");
    }
  }
}

export { SESMailProvider };
