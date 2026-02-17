const drizzle = require('drizzle-orm');

const db = drizzle(process.env.DATABASE_URL);

module.exports = db;