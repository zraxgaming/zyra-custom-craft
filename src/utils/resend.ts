import { Resend } from 'resend';

const resend = new Resend('re_5y517rZC_9KDTPreTXvjjbwwnrVqQ3txF');

export async function sendOrderEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return resend.emails.send({
    from: 'Zyra <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
  });
}

export async function sendBatchNewsletter(emails: { to: string; subject: string; html: string }[]) {
  return resend.batch.send(
    emails.map(email => ({
      from: 'Zyra <onboarding@resend.dev>',
      ...email,
    }))
  );
}
