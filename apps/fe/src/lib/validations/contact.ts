import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng'),

  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),

  email: z
    .string()
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),

  industry: z
    .string()
    .min(2, 'Ngành nghề phải có ít nhất 2 ký tự')
    .max(100, 'Ngành nghề không được quá 100 ký tự'),

  message: z
    .string()
    .min(10, 'Câu hỏi phải có ít nhất 10 ký tự')
    .max(500, 'Câu hỏi không được quá 500 ký tự'),

  captcha: z
    .string()
    .min(4, 'Mã xác thực phải có 4 ký tự')
    .max(4, 'Mã xác thực phải có 4 ký tự'),

  captchaId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
