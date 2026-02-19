import express from 'express';
// const { BOOKS } = require('../db/book');
import { booksTable } from '../models/index.js';
import db from '../db/index.js';
import { eq, or, ilike, sql } from 'drizzle-orm';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';


const router = Router();

router.get('/', async (req, res) => {
try {
const searchQuery = req.query.search || ''; // Get the search query from the request query parameters
console.log("Search query:", searchQuery);
if (searchQuery.length > 0) {
try {

// unoptimized search using ILIKE (case-insensitive LIKE) - may not use index effectively
  const searchBooks = await db.select().from(booksTable).where(
    or(
      ilike(booksTable.title, `%${searchQuery}%`),
      ilike(booksTable.description, `%${searchQuery}%`)
    )
  );

 // Full-text search using PostgreSQL's built-in to_tsvector - more powerful and can use indexes effectively
// const searchBooks = await db.select().from(booksTable).where(
//   sql`to_tsvector('simple', ${booksTable.title}) @@ to_tsquery('simple', ${searchQuery})`
// );

console.log("Search results:", searchBooks);
  
  return res.status(200).json(searchBooks);
} catch (error) {

  return res.status(500).json({ error: 'Error fetching search results' });
}

}
  const books = await db.select().from(booksTable); 

  return res.status(200).json(books);
} catch (error) {
  console.error('Error fetching books:', error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
  
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await db.select().from(booksTable).where(eq(booksTable.id, id)).limit(1).execute(); // SELECT * from books where id = {id} limit 1
  
    if (!book)
      return res
        .status(404)
        .json({ error: `Book with id ${id} does not exists!` });
  
    return res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, authorId, description } = req.body;
  
    if (!title || title === '')
      return res.status(400).json({ error: 'title is required' });
  
    if (!authorId || authorId === '')
      return res.status(400).json({ error: 'authorId is required' });
  
    if (!description || description === '')
      return res.status(400).json({ error: 'description is required' });
  
    await db.insert(booksTable).values({ id : uuidv4(),title, authorId, description });
  
    return res.status(201).json({ message: 'Book created success' });
  } catch (error) {
    console.error('Error creating book:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
 try {
   const id = req.params.id ;
 
   // const indexToDelete = BOOKS.findIndex((e) => e.id === id);
   await booksTable.delete().where(eq(booksTable.id, id)).execute(); // DELETE from books where id = {id}
   const allBooks = await db.select().from(booksTable); // SELECT * from books
   return res.status(200).json({ message: 'book deleted' , books: allBooks});
 } catch (error) {
   console.error('Error deleting book:', error);
   return res.status(500).json({ error: 'Internal Server Error' });
 }
});

export default router;
