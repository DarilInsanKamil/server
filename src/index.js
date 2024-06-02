const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;
app.use(bodyParser.json());


const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '18.136.208.197',
    port: 5432,
    database: 'bookstore',
  });


app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get("/book", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM book');
        res.send(rows)
        res.status(200).send('Get book success');
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
});
app.get("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(`SELECT * FROM book WHERE id = $1`, [id]);
        if (rows.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(404).send({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
});
app.post("/book", async (req, res) => {
    try {
        const { name, author } = req.body;
        const newBook = await pool.query(
            `INSERT INTO book (name, author) VALUES ($1, $2) RETURNING *`, [name, author])
        res.status(201).send(newBook.rows[0])
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
})
app.put("/book/:id", async (req, res) => {
    try {
        const { name, author } = req.body;
        const { id } = req.params;
        if (!name || !author) {
            res.status(400).send("all field are required")
        }
        const updateBook = await pool.query(`UPDATE book SET name = $1, author = $2 WHERE id = $3 RETURNING *`, [name, author, id]);
        res.status(200).json(updateBook.rows[0]).send("update success");
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ err: error.message });
    }
})
app.delete("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send("id not found");
        }
        const { rows } = await pool.query(`DELETE FROM book WHERE id = $1 RETURNING *`, [id]);
        if (rows.length > 0) {
            res.status(200).send("delete book success");
        } else {
            res.status(404).send("Book not found");
        }
    } catch (error) {

    }
})
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
}); 