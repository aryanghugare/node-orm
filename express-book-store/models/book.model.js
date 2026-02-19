import {pgTable, serial, text, integer,uuid , varchar , index} from 'drizzle-orm/pg-core';
import { authorsTable } from './author.model.js';
import { sql } from 'drizzle-orm';

const booksTable = pgTable('books', {
  id: uuid().primaryKey(),
  title: varchar().notNull(),
  description: text(),
  authorId : uuid().references(()=> authorsTable.id).notNull(),

},(table)=>({
  // GIN index for full-text search (optimizes to_tsvector searches)
  titleSearchIndex: index("idx_books_title_search").using("gin", sql`to_tsvector('english', ${table.title})`),
}));

export {
  booksTable
};