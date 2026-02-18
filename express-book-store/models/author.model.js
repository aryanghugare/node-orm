import {pgTable, serial, text, integer,uuid , varchar} from 'drizzle-orm/pg-core';


const  authorsTable = pgTable('authors', {
    id: uuid().primaryKey(),
    firstName: varchar().notNull(),
    lastName: varchar(),
    email : varchar().notNull().unique(),
    
});

export {
    authorsTable}

