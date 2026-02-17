import express from 'express';
// const { BOOKS } = require('../db/book');
import { booksTable } from '../models';
import db from '../db/index.js';
const router = express.Router();

router.get('/', async (req, res) => {
const books = await db.select().from(booksTable); 
res.json(books);
  
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: `id must be of type number` });

  const book = await db.select().from(booksTable).where(booksTable.id.eq(id)).limit(1).execute(); // SELECT * from books where id = {id} limit 1

  if (!book)
    return res
      .status(404)
      .json({ error: `Book with id ${id} does not exists!` });

  return res.json(book);
});

router.post('/', async (req, res) => {
  const { title, authorId, description } = req.body;

  if (!title || title === '')
    return res.status(400).json({ error: 'title is required' });

  if (!authorId || authorId === '')
    return res.status(400).json({ error: 'authorId is required' });

  if (!description || description === '')
    return res.status(400).json({ error: 'description is required' });

  await db.insert(booksTable).values({ title, authorId, description });

  return res.status(201).json({ message: 'Book created success' });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: `id must be of type number` });

  // const indexToDelete = BOOKS.findIndex((e) => e.id === id);
booksTable.delete().where(booksTable.id.eq(id)).execute(); // DELETE from books where id = {id}
const allBooks = await db.select().from(booksTable); // SELECT * from books
  return res.status(200).json({ message: 'book deleted' , books: allBooks});
});

module.exports = router;
