const express = require("express");
const { getAllBooks, getBookById, postBook, updateBookById, deleteBookById } = require("./book.service");

const router = express.Router();

router.get("/api/book", async (req, res) => {
    const books = await getAllBooks();
    res.json({ data: books })
})
router.get("/api/book/:id", async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const book = await getBookById(bookId);
        res.json({ data: book })

    } catch (error) {
        res.status(500).send(error.message);
    }
})
router.post("/api/book", async (req, res) => {
    try {
        const newBookData = req.body;
        const book = await postBook(newBookData);
        res.status(201).json({
            data: book,
            message: "success"
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})
router.put("/api/book/:id", async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const bookData = req.body;
        if (!bookData.name && !bookData.author) {
            return res.status(400).send("Some field are missing")
        }
        const book = await updateBookById(bookId, bookData);
        res.json({
            data: book,
            message: "update book success",
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})
router.patch("/api/book/:id", async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const bookData = req.body;
        if (!bookData.name && !bookData.author) {
            return res.status(400).send("Some field are missing")
        }
        const book = await updateBookById(bookId, bookData);
        res.json({
            data: book,
            message: "update book success",
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})
router.delete("/api/book/:id", async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        await deleteBookById(bookId);
        res.status(200).send("book deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})
module.exports = router;