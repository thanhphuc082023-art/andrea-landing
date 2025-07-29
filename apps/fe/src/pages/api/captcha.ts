import svgCaptcha from 'svg-captcha';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Create captcha
      const captcha = svgCaptcha.create({
        size: Number(process.env.NEXT_PUBLIC_MAX_LENGTH_CAPTCHA), // characters length
        ignoreChars: '0o1il', // ignore confusing characters
        noise: 2, // noise lines
        fontSize: Number(process.env.NEXT_PUBLIC_FONT_SIZE_CAPTCHA),
        width: 120,
        height: 40,
      });

      // Store captcha text in session/memory (in production, use Redis or similar)
      // For demo, we'll return both (in production, only return SVG)
      res.setHeader('Content-Type', 'application/json');

      return res.status(200).json({
        svg: captcha.data,
        text: captcha.text, // Remove this in production
        id: Date.now().toString(), // Simple ID generation
      });
    } catch (error) {
      console.error('Captcha generation error:', error);
      return res.status(500).json({ error: 'Failed to generate captcha' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: 'Method not allowed' });
}
