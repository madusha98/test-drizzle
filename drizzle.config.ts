import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'test_drizzle',
    ssl: false,
  },
});
