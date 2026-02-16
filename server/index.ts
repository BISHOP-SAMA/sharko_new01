import express from 'express';
import { Resend } from 'resend';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
app.use(express.json());

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

app.post('/api/register', async (req, res) => {
  try {
    const { walletAddress, xUsername, discordUsername } = req.body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ message: 'Invalid EVM wallet address format' });
    }

    if (!resend) {
      console.log('RESEND_API_KEY not configured, skipping email');
      return res.status(200).json({ success: true, message: 'Registration recorded (email not sent - no API key)' });
    }

    await resend.emails.send({
      from: 'Shacko Whitelist <onboarding@resend.dev>',
      to: process.env.RESEND_TO_EMAIL || 'degenerativeshack@gmail.com',
      subject: 'New Shacko Whitelist Registration',
      html: `
        <h2>New Whitelist Registration</h2>
        <p><strong>Wallet Address:</strong> ${walletAddress}</p>
        <p><strong>X Username:</strong> ${xUsername || 'Not provided'}</p>
        <p><strong>Discord Username:</strong> ${discordUsername || 'Not provided'}</p>
        <p><strong>Registered At:</strong> ${new Date().toISOString()}</p>
      `,
    });

    console.log(`[RESEND] Email sent for registration: ${walletAddress}`);
    return res.status(200).json({ success: true, message: 'Registration successful!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to process registration' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
