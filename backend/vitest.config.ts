import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // globalSetup รันครั้งเดียวก่อนทุกไฟล์ → ล้าง DB ครั้งเดียว
    globalSetup: ['./tests/globalSetup.ts'],
    // setupFiles รันต่อ 1 file → แค่ set env vars ไม่ cleanup
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 15000,
    reporters: ['verbose'],
    // รัน sequential เพื่อกัน race condition บน dev.db (SQLite)
    fileParallelism: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/scripts/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
