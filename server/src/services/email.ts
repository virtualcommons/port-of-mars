import nodemailer from 'nodemailer';

export async function sendIssue(
  issueText: string,
  userEmail: string
): Promise<boolean> {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const message = {
    from: 'Sender Name <sender@example.com>',
    to: 'Recipient <recipient@example.com>',
    subject: 'New Issue Submission',
    text: `${issueText}\nSubmitted by ${userEmail}`,
    html: `<p>${issueText}</p></br><p>Submitted by ${userEmail}<p>`
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return true;
}
