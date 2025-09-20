# Vercel Deployment Guide

## 🚀 Cách Deploy lên Vercel

### 1. Cài đặt Vercel CLI

```bash
npm i -g vercel
# hoặc
pnpm add -g vercel
```

### 2. Login vào Vercel

```bash
vercel login
```

### 3. Deploy lần đầu

```bash
# Deploy preview (staging)
pnpm run deploy:preview

# Deploy production
pnpm run deploy
```

### 4. Deploy với force (xóa cache)

```bash
# Force rebuild và deploy
pnpm run deploy:force
```

## ⚙️ Cấu hình Environment Variables

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào Settings → Environment Variables
4. Thêm các biến môi trường cần thiết:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Andrea Landing
DATABASE_URL=your_database_url
NEXT_PUBLIC_STRAPI_URL=your_strapi_url
STRAPI_API_TOKEN=your_strapi_token
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🔧 Cấu hình Build Settings

1. Vào Settings → General
2. Cấu hình:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/fe`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

## 🚨 Giải quyết vấn đề Cache

### Nếu production vẫn chạy phiên bản cũ:

1. **Force Deploy:**

```bash
pnpm run deploy:force
```

2. **Xóa cache Vercel:**
   - Vào Vercel Dashboard
   - Settings → Functions
   - Clear Function Cache

3. **Xóa cache CDN:**
   - Vào Vercel Dashboard
   - Settings → Domains
   - Purge Cache

4. **Kiểm tra Build Logs:**
   - Vào Deployments
   - Click vào deployment mới nhất
   - Xem Build Logs để đảm bảo build thành công

## 📝 Scripts có sẵn

- `pnpm run deploy` - Deploy production
- `pnpm run deploy:preview` - Deploy preview
- `pnpm run deploy:force` - Force rebuild và deploy
- `pnpm run build:force` - Force rebuild local

## 🔍 Debugging

### Kiểm tra build ID:

```bash
# Xem build ID trong .next/BUILD_ID
cat .next/BUILD_ID
```

### Kiểm tra cache headers:

```bash
# Test cache headers
curl -I https://your-domain.vercel.app/_next/static/chunks/main.js
```

### Kiểm tra version react-email-editor:

```bash
# Tìm trong build
grep -r "react-email-editor" .next/static/chunks/
```

## 🎯 Best Practices

1. **Luôn test trước khi deploy production**
2. **Sử dụng preview deployments cho testing**
3. **Monitor build logs để phát hiện lỗi**
4. **Sử dụng environment variables cho config**
5. **Enable analytics để monitor performance**
