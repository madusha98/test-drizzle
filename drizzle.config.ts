import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'test',
    ssl: false,
  },
});
