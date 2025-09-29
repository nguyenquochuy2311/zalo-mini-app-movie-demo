import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import miniApp from 'zmp-vite-plugin'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [
      react(),
      basicSsl(),
      splitVendorChunkPlugin(),
      miniApp({
        app: {
          title: 'QR Menu',
          headerTitle: 'QR Menu',
          textColor: 'white',
          statusBar: 'transparent',
          actionBarHidden: true,
          hideAndroidBottomNavigationBar: true,
          hideIOSSafeAreaBottom: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  })
}
