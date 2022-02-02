import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

const path = require('path');

module.exports = {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
  },
  plugins: [vue(), svgLoader()],
  alias: {
    '/@': path.resolve(__dirname, '/src')
  }
}