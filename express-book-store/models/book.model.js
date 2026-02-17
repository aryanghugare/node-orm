const {pgTable, serial, text, integer,uuid , varchar} = require('drizzle-orm/pg-core');
const authorsTable = require('./author.model');

const booksTable = pgTable('books', {
  id: uuid().primaryKey(),
  title: varchar().notNull(),
  description: text(),
  authorId : uuid().references(()=> authorsTable.id).notNull(),

});

module.exports = {
  booksTable
};
