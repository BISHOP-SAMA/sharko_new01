import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { walletAddress, xUsername, discordUsername } = req.body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ message: 'Invalid EVM wallet address format' });
    }

    const emailResult = await resend.emails.send({
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

    return res.status(200).json({ success: true, message: 'Registration successful!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to process registration' });
  }
}
