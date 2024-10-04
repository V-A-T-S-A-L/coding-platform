const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '23883529',  
    database: 'compiler-app'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Create user schema
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        password VARCHAR(255),
        email VARCHAR(255),
        profile_pic VARCHAR(255)
    )
`);

// Signup route
app.post('/signup', (req, res) => {
    const { name, password, email, profilePic } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (name, password, email, profile_pic) VALUES (?, ?, ?, ?)';
    db.query(query, [name, hashedPassword, email, profilePic], (err, result) => {
        if (err) return res.status(500).send('Error creating user');
        res.status(201).send(req.body);
    });
});

// Login route
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    const query = 'SELECT * FROM users WHERE name = ?';
    db.query(query, [name], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('User not found');

        const user = result[0];
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).send('Invalid credentials');

        res.status(200).json({ name: user.name, profilePicPath: user.profile_pic });
    });
});

app.listen(5000);
console.log("Working");