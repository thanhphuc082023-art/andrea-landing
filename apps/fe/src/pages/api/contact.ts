import type { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

// Form data interface
interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  industry: string;
  securityCode: string;
  message: string;
  captcha: string;
  captchaId: string;
}

// Email template
const createEmailTemplate = (data: ContactFormData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Liên hệ mới từ Andrea</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1A253A; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1A253A; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #ff6b35; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Liên hệ mới từ Andrea</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Tên khách hàng:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">📞 Điện thoại:</div>
            <div class="value">${data.phone}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">🏢 Ngành nghề:</div>
            <div class="value">${data.industry}</div>
          </div>
          <div class="field">
            <div class="label">💬 Câu hỏi:</div>
            <div class="value">${data.message}</div>
          </div>
          <div class="field">
            <div class="label">🕐 Thời gian:</div>
            <div class="value">${new Date().toLocaleString('vi-VN')}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

// Save to Strapi
async function saveToStrapi(data: ContactFormData) {
  try {
    const strapiData = {
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        industry: data.industry,
        message: data.message,
        submittedAt: new Date().toISOString(),
      },
    };

    // Replace with your Strapi URL and endpoint
    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    const response = await fetch(`${strapiUrl}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Strapi save error:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData: ContactFormData = req.body;

    // Validate required fields
    const requiredFields = [
      'name',
      'phone',
      'email',
      'industry',
      'message',
      'captcha',
    ];

    const missingField = requiredFields.find(
      (field) => !formData[field as keyof ContactFormData]
    );

    if (missingField) {
      return res.status(400).json({
        error: `Trường ${missingField} là bắt buộc`,
        field: missingField,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        error: 'Email không hợp lệ',
        field: 'email',
      });
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        error: 'Số điện thoại không hợp lệ',
        field: 'phone',
      });
    }

    // TODO: Validate captcha (implement captcha verification)
    // For now, we'll skip captcha validation

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: 'citythree.11798@gmail.com',
      subject: `🔔 Yêu cầu tư vấn của ${formData.name}`,
      html: createEmailTemplate(formData),
    };

    await transporter.sendMail(mailOptions);

    // Save to Strapi
    await saveToStrapi(formData);

    return res.status(200).json({
      success: true,
      message: 'Form đã được gửi thành công!',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại.',
      details:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
}
