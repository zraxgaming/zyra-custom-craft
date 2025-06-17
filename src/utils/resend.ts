export async function sendOrderEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to send email');
  }
  return true;
}

export async function sendBatchNewsletter(emails: { to: string; subject: string; html: string }[]) {
  // For batch, call /api/send-email for each email (or implement a batch endpoint if needed)
  return Promise.all(emails.map(email => sendOrderEmail(email)));
}
