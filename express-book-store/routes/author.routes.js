import express from 'express';
import { booksTable } from '../models/index.js';
import { authorsTable } from '../models/index.js';
import db from '../db/index.js';
import { eq, or, ilike, sql } from 'drizzle-orm';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all authors
router.get('/', async (req, res) => {
try {
   const authors = await db.select().from(authorsTable);
   return res.status(200).json(authors);
} catch (error) {
   return res.status(500).json({ error: 'Error while fetching the authors' }); 
}
})

// Adding a new author
router.post('/', async (req, res) => {
const {firstName , lastName, email} = req.body;

if(!firstName || !email){
    return res.status(400).json({error: "First name and email are required!"});
}
try {
    await db.insert(authorsTable).values({ id: uuidv4(), firstName, lastName, email });
    return res.status(201).json({ message: 'Author created successfully' });
} catch (error) {
    return res.status(500).json({ error: 'Error while creating the author' });
}


})

// Get author by id
router.get('/:id', async (req, res) => {
const id = req.params.id;
console.log("Fetching author with id:", id);

try {
    const author = await db.select().from(authorsTable).where(eq(authorsTable.id, id)).limit(1).execute();
    if(author.length === 0){
        return res.status(404).json({error: ` Author with that id does not exist!`});
    }
    return res.status(200).json(author);
} catch (error) {
    return res.status(500).json({ error: 'Error while fetching the author' });
}

})

// Delete author by id
router.delete('/:id', async (req, res) => {
const id = req.params.id;
console.log("Deleting author with id:", id);
try {
// First delete the books of the author to maintain referential integrity
 const booksDeleteResult = await db.delete(booksTable).where(eq(booksTable.authorId, id)).execute();
if(booksDeleteResult.rowCount === 0){
    console.log("No books found for the author or error while deleting the books of the author");
}
// Then delete the author
    const result = await db.delete(authorsTable).where(eq(authorsTable.id, id)).execute();

    if(result.rowCount === 0){
        return res.status(404).json({error: `Author you are looking to delete does not exist!`});
    }
console.log("hello");
    return res.status(203).json({ message: 'Author deleted successfully' });
} catch (error) {
    return res.status(500).json({ error: 'Error while deleting the author' });
}

})

router.get('/:id/books', async (req, res) => {
const id = req.params.id;
console.log("Fetching books of author with id:", id);
try {
    const books = await db.select().from(booksTable).where(eq(booksTable.authorId, id)).execute();
    return res.status(200).json(books);
} catch (error) {
    return res.status(500).json({ error: 'Error while fetching the books of the author' });
}


})



export default router;

