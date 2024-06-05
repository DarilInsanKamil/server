const { findBooks, findBookById, insertBook, editBook, deleteBook } = require('./book.repository.js');

const getAllBooks = async () => {
    const books = await findBooks();
    return books;
};

const getBookById = async (id) => {
    const book = await findBookById(id);
    if (!book) {
        throw Error("Book not found")
    }
    return book;
}
const postBook = async (newBookData) => {
    const book = await insertBook(newBookData);
    return book;
}
const updateBookById = async (id, editBookData) => {
    await getBookById(id)
    const book = await editBook(id, editBookData);
 
    return book;
}
const deleteBookById = async (id) => {
    await getBookById(id);
    const book = await deleteBook(id);
    return book;
}
module.exports = {
    getAllBooks,
    getBookById,
    postBook,
    updateBookById,
    deleteBookById
}