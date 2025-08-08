# E-Profile Embed Guide

Hướng dẫn nhúng E-Profile vào website khác một cách đơn giản và hiệu quả.

## 📋 Tổng quan

E-Profile Embed cho phép bạn nhúng các E-Profile tương tác vào bất kỳ website nào thông qua iframe. Hệ thống được tối ưu hóa để hoạt động mượt mà trên mọi thiết bị và trình duyệt.

## 🚀 Cách sử dụng nhanh

### 1. Iframe đơn giản

```html
<iframe
  src="https://andrea-landing.vercel.app/embed/e-profile/[slug]"
  width="100%"
  height="600px"
  style="border: none; border-radius: 8px;"
  allowfullscreen
  title="E-Profile"
>
</iframe>
```

**Thay `[slug]` bằng slug thực của E-Profile (ví dụ: `andrea`, `sample-book`)**

### 2. Với styling nâng cao

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe
    src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
    width="100%"
    height="600px"
    style="
      border: none; 
      border-radius: 12px; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background: #f3f4f6;
    "
    allowfullscreen
    title="Andrea E-Profile"
  >
  </iframe>
</div>
```

## 🎨 Tùy chỉnh kích thước

### Desktop

```html
<!-- Fullscreen Desktop -->
<iframe
  src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
  width="100%"
  height="800px"
  style="border: none; min-height: 600px;"
  allowfullscreen
>
</iframe>
```

### Mobile Responsive

```html
<div class="embed-container">
  <iframe
    src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
    allowfullscreen
  >
  </iframe>
</div>

<style>
  .embed-container {
    position: relative;
    padding-bottom: 75%; /* 4:3 Aspect Ratio */
    height: 0;
    overflow: hidden;
    max-width: 100%;
  }

  .embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: 768px) {
    .embed-container {
      padding-bottom: 125%; /* Taller on mobile */
    }
  }
</style>
```

### Compact Version

```html
<!-- Compact cho sidebar hoặc preview -->
<iframe
  src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
  width="100%"
  height="400px"
  style="border: none; border-radius: 8px;"
  allowfullscreen
>
</iframe>
```

## ⚙️ Tính năng nâng cao

### 1. Sử dụng JavaScript để kiểm soát

```html
<div id="eprofile-container" style="width: 100%; height: 600px;"></div>

<script>
  function loadEProfile(slug, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://andrea-landing.vercel.app/embed/e-profile/${slug}`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.allowFullscreen = true;
    iframe.title = `${slug} E-Profile`;

    // Loading state
    container.innerHTML =
      '<div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f3f4f6;"><p>Đang tải E-Profile...</p></div>';

    iframe.onload = () => {
      container.innerHTML = '';
      container.appendChild(iframe);
    };

    iframe.onerror = () => {
      container.innerHTML =
        '<div style="text-align: center; padding: 40px; background: #f3f4f6;"><h3>Không thể tải E-Profile</h3><p><a href="https://andrea-landing.vercel.app/e-profile/' +
        slug +
        '" target="_blank">Mở trong tab mới</a></p></div>';
    };

    setTimeout(() => {
      container.appendChild(iframe);
    }, 100);
  }

  // Sử dụng
  loadEProfile('andrea', 'eprofile-container');
</script>
```

### 2. Với PostMessage Communication

```html
<iframe
  id="eprofile-iframe"
  src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
  width="100%"
  height="600px"
  style="border: none;"
  allowfullscreen
>
</iframe>

<script>
  // Lắng nghe messages từ E-Profile iframe
  window.addEventListener('message', (event) => {
    if (
      event.data.type === 'IFRAME_LOADED' &&
      event.data.source === 'e-profile-embed'
    ) {
      console.log('E-Profile loaded:', event.data.data.title);

      if (event.data.data.status === 'success') {
        // E-Profile loaded successfully
        document.getElementById('loading').style.display = 'none';
      } else {
        // Handle error
        console.error('E-Profile loading error');
      }
    }
  });
</script>
```

### 3. Lazy Loading

```html
<div
  id="eprofile-lazy"
  data-slug="andrea"
  style="width: 100%; height: 600px; background: #f3f4f6; display: flex; justify-content: center; align-items: center; cursor: pointer;"
  onclick="loadEProfileLazy(this)"
>
  <div style="text-align: center;">
    <div
      style="width: 60px; height: 60px; margin: 0 auto 16px; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center;"
    >
      📖
    </div>
    <h3 style="margin: 0 0 8px; color: #374151;">E-Profile</h3>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">Click để xem</p>
  </div>
</div>

<script>
  function loadEProfileLazy(element) {
    const slug = element.dataset.slug;
    element.innerHTML =
      '<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><div style="width: 24px; height: 24px; border: 2px solid #3b82f6; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div></div>';

    setTimeout(() => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://andrea-landing.vercel.app/embed/e-profile/${slug}`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.allowFullscreen = true;
      iframe.title = `${slug} E-Profile`;

      element.innerHTML = '';
      element.appendChild(iframe);
      element.onclick = null;
    }, 500);
  }
</script>

<style>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
```

## 🔧 Tùy chọn cấu hình

### URLs có sẵn

| URL Pattern                           | Mô tả             | Sử dụng                |
| ------------------------------------- | ----------------- | ---------------------- |
| `/embed/e-profile/[slug]`             | Embed chuyên dụng | Nhúng vào website khác |
| `/e-profile/[slug]?simpleLayout=true` | Simple layout     | Fallback option        |

### Kích thước khuyến nghị

| Thiết bị | Width | Height    | Lý do                |
| -------- | ----- | --------- | -------------------- |
| Desktop  | 100%  | 600-800px | Đọc thoải mái        |
| Tablet   | 100%  | 500-600px | Cân bằng UI          |
| Mobile   | 100%  | 400-500px | Tiết kiệm không gian |

### Attributes iframe quan trọng

```html
<iframe
  src="..."
  width="100%"           <!-- Responsive width -->
  height="600px"         <!-- Minimum height for good UX -->
  allowfullscreen        <!-- Cho phép fullscreen -->
  loading="lazy"         <!-- Lazy load để tối ưu performance -->
  title="E-Profile"      <!-- Accessibility -->
  style="border: none;"  <!-- Clean appearance -->
  sandbox="allow-scripts allow-same-origin allow-popups">
</iframe>
```

## 🎯 Các ví dụ sử dụng thực tế

### 1. Blog Post Embed

```html
<article>
  <h2>Giới thiệu Portfolio của tôi</h2>
  <p>Xem portfolio tương tác của tôi bên dưới:</p>

  <div style="margin: 32px 0;">
    <iframe
      src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
      width="100%"
      height="600px"
      style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
      allowfullscreen
      title="Andrea Portfolio"
    >
    </iframe>
  </div>

  <p>Portfolio được cập nhật thường xuyên với các dự án mới nhất.</p>
</article>
```

### 2. Product Showcase

```html
<div class="product-showcase">
  <div class="product-info">
    <h3>E-Profile Premium</h3>
    <p>Portfolio tương tác với hiệu ứng 3D flipbook</p>
    <button>Mua ngay - $29</button>
  </div>

  <div class="product-demo">
    <iframe
      src="https://andrea-landing.vercel.app/embed/e-profile/sample-book"
      width="100%"
      height="500px"
      style="border: none; border-radius: 8px;"
      allowfullscreen
    >
    </iframe>
  </div>
</div>
```

### 3. Landing Page Hero

```html
<section class="hero">
  <div class="hero-content">
    <h1>Chào mừng đến với Portfolio của tôi</h1>
    <p>Khám phá các dự án và kinh nghiệm của tôi</p>
  </div>

  <div class="hero-embed">
    <iframe
      src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
      width="100%"
      height="700px"
      style="border: none; border-radius: 16px;"
      allowfullscreen
    >
    </iframe>
  </div>
</section>
```

## 🔒 Bảo mật và Performance

### Bảo mật

- ✅ Sandbox iframe với permissions cần thiết
- ✅ HTTPS only
- ✅ No-referrer policy
- ✅ CSP headers được cấu hình đúng

### Performance

- ✅ Static generation với ISR
- ✅ CDN caching
- ✅ Lazy loading support
- ✅ Optimized assets

### SEO

- ✅ Noindex cho embed pages (tránh duplicate content)
- ✅ Proper meta tags
- ✅ Structured data friendly

## 🛠️ Troubleshooting

### Iframe không hiển thị

```javascript
// Check nếu iframe bị block
const iframe = document.getElementById('my-iframe');
iframe.onerror = () => {
  console.error('Iframe blocked or failed to load');
  // Show fallback content
};
```

### Responsive issues

```css
/* Ensure iframe scales properly */
iframe {
  max-width: 100%;
  height: auto;
  aspect-ratio: 4 / 3; /* Modern browsers */
}

/* Fallback cho older browsers */
@supports not (aspect-ratio: 4 / 3) {
  .iframe-container {
    position: relative;
    padding-bottom: 75%;
    height: 0;
  }

  .iframe-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
```

### Loading state

```html
<div id="embed-container">
  <div
    id="loading-state"
    style="
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 600px; 
    background: #f9fafb;
  "
  >
    <div>Đang tải E-Profile...</div>
  </div>
</div>

<script>
  const iframe = document.createElement('iframe');
  iframe.onload = () => {
    document.getElementById('loading-state').remove();
  };
  // ... setup iframe
</script>
```

## 📱 Mobile Optimization

### Touch-friendly

```html
<iframe
  src="https://andrea-landing.vercel.app/embed/e-profile/andrea"
  width="100%"
  height="500px"
  style="
    border: none;
    border-radius: 8px;
    touch-action: pan-x pan-y; /* Better touch handling */
  "
  allowfullscreen
>
</iframe>
```

### Viewport considerations

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />

<style>
  @media (max-width: 768px) {
    .embed-container {
      padding: 16px;
    }

    .embed-container iframe {
      height: 400px; /* Smaller on mobile */
      border-radius: 4px;
    }
  }
</style>
```

## 💡 Best Practices

1. **Always set a title** cho accessibility
2. **Use loading="lazy"** để improve page performance
3. **Provide fallback content** cho trường hợp iframe fail
4. **Set appropriate height** (minimum 400px)
5. **Test trên multiple devices** và browsers
6. **Monitor performance** với Core Web Vitals

## 📞 Hỗ trợ

- **Trang test**: [https://andrea-landing.vercel.app/embed-test](https://andrea-landing.vercel.app/embed-test)
- **Documentation**: [GitHub Repository](https://github.com/thanhphuc082023-art/andrea-landing)
- **Issues**: [GitHub Issues](https://github.com/thanhphuc082023-art/andrea-landing/issues)

## 🔄 Updates

E-Profile embed được cập nhật thường xuyên với:

- Performance improvements
- New features
- Bug fixes
- Security updates

Embedded content sẽ tự động cập nhật mà không cần thay đổi code embed.

---

**Happy Embedding! 🚀**
