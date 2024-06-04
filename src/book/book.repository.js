
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '18.136.208.197',
    // host: 'localhost',
    port: 5432,
    database: 'bookstore',
});


const findBooks = async () => {
    try {
        const books = await pool.query('SELECT * FROM book');
        return books.rows;
    } catch (error) {
        console.error(error);
    }
};
const findBookById = async (id) => {
    const books = await pool.query(`SELECT * FROM book WHERE id = ${id}`);
    return books.rows[0];

}
const insertBook = async (bookData) => {
    const newBook = await pool.query(
        `INSERT INTO book (name, author) VALUES ($1, $2) RETURNING *`, [bookData.name, bookData.author])
    return newBook.rows[0];

}
const editBook = async (id, bookData) => {
    const updateBook = await pool.query(`UPDATE book SET name = $1, author = $2 WHERE id = $3 RETURNING *`, [bookData.name, bookData.author, id])
    return updateBook.rows[0];

}
const deleteBook = async (id) => {
    const book = await pool.query(`DELETE FROM book WHERE id = $1 RETURNING *`, [id]);
    return book;
}
module.exports = {
    findBooks,
    findBookById,
    insertBook,
    editBook,
    deleteBook
}