module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      // Cấu hình autoprefixer cho Safari cũ
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Safari >= 9',
        'iOS >= 9',
      ],
      grid: true, // Hỗ trợ CSS Grid
      flexbox: true, // Hỗ trợ Flexbox
    },
    // Thêm postcss-preset-env để hỗ trợ CSS modern features
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': false, // Tắt vì đã dùng tailwindcss/nesting
        'custom-properties': true,
        'color-function': true,
      },
    },
  },
};
