# Contact Form Setup Instructions

## 🚀 Tính năng đã hoàn thành

### ✅ Form Validation

- Validation thời gian thực với React Hook Form + Zod
- Kiểm tra định dạng email, số điện thoại Việt Nam
- Validation độ dài và ký tự đặc biệt

### ✅ CAPTCHA Anti-spam

- Sử dụng thư viện `svg-captcha`
- Click để tạo captcha mới
- Validation captcha phía client và server

### ✅ Email Template

- Gửi email đẹp định dạng HTML
- Template responsive với thông tin đầy đủ
- Gửi đến email: `citythree.11798@gmail.com`

### ✅ Strapi Integration

- Lưu trữ form submissions vào Strapi
- Schema đầy đủ với các trường cần thiết
- Quản lý trạng thái submission

## 🛠️ Setup Instructions

### 1. Cấu hình Email

Tạo file `.env.local`:

```bash
# Email Configuration (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-token

NODE_ENV=development
```

**Lưu ý Gmail:**

- Bật 2FA cho Gmail account
- Tạo App Password: Google Account > Security > 2-Step Verification > App passwords
- Sử dụng App Password thay vì mật khẩu thường

### 2. Cấu hình Strapi

1. **Tạo Content Type trong Strapi:**
   - Vào Admin Panel: `http://localhost:1337/admin`
   - Content-Type Builder > Create new collection type
   - Tên: `contact-submission`
   - Import schema từ file `strapi-schema-contact-submissions.json`

2. **Cấu hình Permissions:**
   - Settings > Users & Permissions plugin > Roles
   - Public role > contact-submission: enable `create`
   - Hoặc tạo API token riêng

### 3. Cài đặt Dependencies

```bash
cd apps/fe
pnpm add react-hook-form @hookform/resolvers zod nodemailer svg-captcha axios
pnpm add -D @types/nodemailer @types/svg-captcha
```

### 4. Test Form

1. Start development server:

```bash
pnpm dev
```

2. Kiểm tra:
   - Form validation
   - Captcha generation
   - Email sending (check spam folder)
   - Strapi data saving

## 📁 File Structure

```
src/
├── pages/api/
│   ├── captcha.ts          # API tạo captcha
│   └── contact.ts          # API xử lý form submission
├── lib/validations/
│   └── contact.ts          # Zod schema validation
├── hooks/
│   └── useCaptcha.ts       # Custom hook cho captcha
└── contents/index/ContactForm/
    └── index.tsx           # Form component
```

## 🔒 Security Features

- **CAPTCHA**: Ngăn chặn bot spam
- **Rate Limiting**: Có thể thêm để giới hạn số lần submit
- **Input Sanitization**: Zod validation làm sạch input
- **CSRF Protection**: Next.js built-in protection

## 📊 Strapi Admin

Truy cập `http://localhost:1337/admin` để:

- Xem danh sách form submissions
- Quản lý trạng thái (new, contacted, resolved)
- Export data
- Thống kê số lượng liên hệ

## 🐛 Troubleshooting

### Email không gửi được:

- Kiểm tra SMTP credentials
- Bật Less secure app access (Gmail)
- Kiểm tra firewall/antivirus

### Strapi lỗi 403:

- Kiểm tra permissions cho Public role
- Đảm bảo API endpoint đúng

### Captcha không hiển thị:

- Kiểm tra API route `/api/captcha`
- Xem console errors

## 🚀 Production Deployment

1. **Environment Variables:**
   - Cập nhật NEXT_PUBLIC_STRAPI_URL cho production
   - Sử dụng SMTP service chuyên nghiệp (SendGrid, Mailgun)

2. **Security Enhancements:**
   - Add rate limiting
   - Implement CSRF tokens
   - Add request logging

3. **Monitoring:**
   - Add error tracking (Sentry)
   - Monitor email delivery rates
   - Set up Strapi backup

```

```
