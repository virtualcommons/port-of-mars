import Mail from "nodemailer/lib/mailer";

import { settings } from "@port-of-mars/server/settings";

import * as nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';

export interface Emailer {
  sendMail(content: Mail.Options, callback: (err, info) => void): void;
  lastEmail?: Mail.Options;
}

export class MemoryEmailer implements Emailer {
  emails: Array<Mail.Options> = [];

  sendMail(content: Mail.Options) {
    // FIXME: can't use settings.getLogger due to circular import
    const logger = settings.logging.getLogger(__filename);
    this.emails.push(content);
    logger.debug("sending email: %o", content);
  }

  get lastEmail(): Mail.Options | undefined {
    return this.emails.length > 0 ? this.emails[this.emails.length - 1] : undefined;
  }
}

/* eslint-disable @typescript-eslint/camelcase */
export class MailgunEmailer implements Emailer {

  opts: any;
  transport: any;

  constructor(auth: { api_key: string; domain: string }) {
    if (!auth.api_key || !auth.domain) {
      auth.api_key = 'invalid-api-key';
      auth.domain = 'example.com';
    }
    this.opts = { auth }
    this.transport = nodemailer.createTransport(mailgunTransport(this.opts));
  }

  sendMail(content: Mail.Options) {
    this.transport.sendMail(content);
  }
}
