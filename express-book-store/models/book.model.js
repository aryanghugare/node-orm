import {pgTable, serial, text, integer,uuid , varchar} from 'drizzle-orm/pg-core';
import { authorsTable } from './author.model.js';

const booksTable = pgTable('books', {
  id: uuid().primaryKey(),
  title: varchar().notNull(),
  description: text(),
  authorId : uuid().references(()=> authorsTable.id).notNull(),

});

export {
  booksTable
};