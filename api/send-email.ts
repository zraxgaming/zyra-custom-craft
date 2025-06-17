import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Import here so it only runs on server
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY || 're_5y517rZC_9KDTPreTXvjjbwwnrVqQ3txF');
    const result = await resend.emails.send({
      from: 'Zyra <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });
    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
