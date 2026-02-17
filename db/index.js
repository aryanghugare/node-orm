import dotenv from 'dotenv';
dotenv.config(); // This is the wrong place to call dotenv.config() - it should be called in the entry point of your application (e.g., index.js) before any other imports that rely on environment variables.
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
console.log('Database connection established successfully.');

export default db;