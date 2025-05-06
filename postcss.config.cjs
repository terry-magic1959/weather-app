
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ← ここを追加
    autoprefixer: {},            // ← 既存の autoprefixer はそのまま
  }
}
