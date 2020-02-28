import Mail from "nodemailer/lib/mailer";

export interface Emailer {
  sendMail(content: Mail.Options): void;
}

export class ConsoleEmailer implements Emailer {
  sendMail(content: Mail.Options) {
    console.log(content);
  }
}