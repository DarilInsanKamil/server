const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require('pg');
const path = require('path');
const { hash, compare } = require("bcrypt");
const app = express();

const cors = require('cors')
const port = 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '18.136.208.197',
    // host: 'localhost',
    port: 5432,
    database: 'bookstore',
});

//cors
app.use(cors())
// swagger(app)

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})
app.get("/project", async (req, res) => {
    res.sendFile(path.join(__dirname, './public/project.html'));
})
app.get("/about", async (req, res) => {
    res.sendFile(path.join(__dirname, './public/about.html'));
})
app.get("/sign-in", async (req, res) => {
    res.sendFile(path.join(__dirname, './page/signin.html'));
})

//API USER
app.post("/api/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const existingEmail = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingEmail.rows.length > 0) {
            res.status(409).send("Email already exist")
        }
        const hashPassword = await hash(password, 10);

        const newUser = await pool.query(`INSERT INTO users (email ,username, password) VALUES ($1, $2, $3) RETURNING *`, [email, username, hashPassword]);

        res.status(201).send("user created").json(newUser.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})
app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password } = await req.body;

        if (!identifier || !password) {
            return res.status(400).send("Identifier and password are required");
        }

        let query;
        if (identifier.includes('@')) {
            query = `SELECT * FROM users WHERE email = $1`;
        } else {
            query = `SELECT * FROM users WHERE username = $1`;
        }
       
        const result = await pool.query(query, [identifier]);

        if (result.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        const user = result.rows[0];
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).send("incorrect password")
        }
        res.send("Login success").status(200);
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
})

// API BOOK
app.get("/api/book", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM book');
        res.send(rows)
        res.status(200).send('Get book success');
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
});
app.get("/api/user", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.send(rows)
        res.status(200).send('Get book success');
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: error.message });
    }
});
app.get("/api/book/:id", async (req, res) => {
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
app.post("/api/book", async (req, res) => {
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
app.put("/api/book/:id", async (req, res) => {
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
app.delete("/api/book/:id", async (req, res) => {
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
