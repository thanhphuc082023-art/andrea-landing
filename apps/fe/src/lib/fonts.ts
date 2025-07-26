import { Playfair_Display } from 'next/font/google';

export const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['italic', 'normal'],
  display: 'swap',
  variable: '--font-playfair',
});
