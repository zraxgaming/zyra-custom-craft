// WARNING: This exposes your SendGrid API key to the client. Use only if you accept the risk!

export async function sendEmailDirect({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = import.meta.env.local.VITE_SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SendGrid API key not set');

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'zainabusal113@gmail.com', name: 'Zyra Store' },
    subject,
    content: [{ type: 'text/html', value: html }]
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SendGrid error: ${res.status} - ${errorText}`);
  }
  return true;
}
