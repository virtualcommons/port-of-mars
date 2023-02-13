import { settings } from "@port-of-mars/server/settings";

export async function sendIssue(issueText: string, userEmail: string): Promise<boolean> {
  const message = {
    from: "Sender Name <sender@example.com>",
    to: "Recipient <recipient@example.com>",
    subject: "New Issue Submission",
    text: `${issueText}\nSubmitted by ${userEmail}`,
    html: `<p>${issueText}</p></br><p>Submitted by ${userEmail}<p>`,
  };

  await settings.emailer.sendMail(message);

  return true;
}
