const {pgTable, serial, text, integer,uuid , varchar} = require('drizzle-orm/pg-core');


const authorsTable = pgTable('authors', {
    id: uuid().primaryKey(),
    firstName: varchar().notNull(),
    lastName: varchar(),
    email : varchar().notNull().unique(),
    
});

module.exports =  authorsTable

