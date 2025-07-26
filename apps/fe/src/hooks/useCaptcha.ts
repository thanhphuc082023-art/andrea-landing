import { useState, useCallback } from 'react';

interface CaptchaData {
  svg: string;
  text: string;
  id: string;
}

export const useCaptcha = () => {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCaptcha = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/captcha');
      if (!response.ok) {
        throw new Error('Failed to generate captcha');
      }

      const data = await response.json();
      setCaptchaData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCaptcha = useCallback(
    (userInput: string): boolean => {
      if (!captchaData) return false;
      return userInput.toLowerCase() === captchaData.text.toLowerCase();
    },
    [captchaData]
  );

  return {
    captchaData,
    loading,
    error,
    generateCaptcha,
    verifyCaptcha,
  };
};
