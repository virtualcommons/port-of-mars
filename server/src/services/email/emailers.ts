import Mail from "nodemailer/lib/mailer";

export interface Emailer {
  sendMail(content: Mail.Options): void;
  lastEmail?: Mail.Options;
}

export class MemoryEmailer implements Emailer {
  emails: Array<Mail.Options> = [];

  sendMail(content: Mail.Options) {
    this.emails.push(content);
  }

  get lastEmail(): Mail.Options | undefined {
    return this.emails.length > 0 ? this.emails[this.emails.length - 1] : undefined;
  }
}