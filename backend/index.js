const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const moment = require('moment');
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

// Create room schema
db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        admin_id INT NOT NULL,  
        room_code VARCHAR(6) NOT NULL UNIQUE,  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id)  
    )
`);

// Room members schema
db.query(`
    CREATE TABLE IF NOT EXISTS room_members (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT NOT NULL,
        user_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

// Challenges schema

db.query(`
    CREATE TABLE IF NOT EXISTS challenges (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        problem_name VARCHAR(255) NOT NULL,
        explanation TEXT NOT NULL,
        difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
        deadline DATE NOT NULL,
        example_test_cases JSON NOT NULL,
        hidden_test_cases JSON NOT NULL,
        room_id INT NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );    
`)

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

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [name], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('User not found');

        const user = result[0];
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).send('Invalid credentials');

        res.status(200).json({ id: user.id, name: user.name, profilePicPath: user.profile_pic });
    });
});

// Generate room code
const generateRoomCode = () => {
    return crypto.randomBytes(3).toString('hex');  // 6-character long code
};

// Create room
app.post('/create-room', (req, res) => {
    const { roomName, adminId } = req.body;

    const roomCode = generateRoomCode();

    const query = 'INSERT INTO rooms (room_name, admin_id, room_code) VALUES (?, ?, ?)';

    db.query(query, [roomName, adminId, roomCode], (err, result) => {
        if (err) {
            console.error('Error creating room:', err);
            return res.status(500).send('Error creating room');
        }

        const room_id = result.insertId;

        const memberQuery = 'INSERT INTO room_members (room_id, user_id) VALUES (?, ?)';
        db.query(memberQuery, [room_id, adminId], (err, memberResult) => {
            if (err) return res.status(500).send('Error adding admin to room');
            res.status(201).json({ room_id, message: 'Room created successfully' });
        });
    });
});

// Join room 
app.post('/join-room', (req, res) => {
    const { roomCode, user_id } = req.body;

    room_query = 'SELECT id FROM rooms WHERE room_code = ?';

    db.query(room_query, [roomCode], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).send('Room not found');
        }

        const room_id = result[0].id;

        const checkMember = 'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?';
        db.query(checkMember, [room_id, user_id], (err, result1) => {
            if (err) return res.status(500).send('Error checking membership');
            if (result1.length > 0) return res.status(400).send('User already in room');

            const insertMember = 'INSERT INTO room_members (room_id, user_id) VALUES (?, ?)';
            db.query(insertMember, [room_id, user_id], (err, result2) => {
                if (err) return res.status(500).send("Error joining room");
                res.status(200).send('Joined room successfully');
            })
        })
    })
})

// Fetch rooms you have joined
app.get('/user-rooms/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT r.id, r.room_name, rm.joined_at 
        FROM rooms r
        JOIN room_members rm ON r.id = rm.room_id
        WHERE rm.user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).send("Error retrieving rooms");
        }

        const roomsWithTime = result.map(room => {
            const joinedAt = moment(room.joined_at);
            const timeSinceJoined = moment().diff(joinedAt, 'days');
            let timeString = `${timeSinceJoined} days ago`;

            if (timeSinceJoined >= 30) {
                const months = moment().diff(joinedAt, 'months');
                timeString = `${months} months ago`;
            }

            return {
                room_id: room.id,
                roomName: room.room_name,
                timeSinceJoined: timeString
            };
        });

        res.status(200).json(roomsWithTime);
    });
});

// Get data of room you entered

app.get('/get-room/:room_id', (req, res) => {
    const { room_id } = req.params;

    const query = `
        SELECT * FROM rooms WHERE id = ?
    `;

    db.query(query, [room_id], (err, result) => {
        if (err) return res.status(500).send("Error fetching data");
        res.status(200).send(result[0])
    });
});

// Create new challenge 

app.post('/create-challenge/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { problemName, explanation, difficulty, deadline, exampleTestCases, hiddenTestCases, created_by } = req.body;

    const query = `
        INSERT INTO challenges (problem_name, explanation, difficulty, deadline, example_test_cases, hidden_test_cases, room_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        problemName,
        explanation,
        difficulty,
        deadline,
        JSON.stringify(exampleTestCases),
        JSON.stringify(hiddenTestCases),
        roomId,
        created_by
    ], (err, result) => {
        if (err) {
            console.error('Error inserting challenge:', err);
            res.status(500).json({ message: 'Failed to create challenge' });
        } else {
            res.status(201).json({ message: 'Challenge created successfully', challengeId: result.insertId });
        }
    });
});

// Get problems inside a room

app.get('/get-problems/:room_id', (req, res) => {
    const { room_id } = req.params;

    const query = `
        SELECT * FROM challenges
        WHERE room_id = ?
    `;

    db.query(query, [room_id], (err, result) => {
        if (err) return res.status(500).send("Error fetching data");
        res.status(200).send(result)
    });
});

// Get members in a room

app.get('/get-members/:room_id', (req, res) => {
    const { room_id } = req.params;

    const query = `
        SELECT u.name, u.email, r.joined_at
        FROM room_members r
        JOIN users u
        ON u.id = r.user_id
        WHERE r.room_id = ?
    `;

    db.query(query, [room_id], (err, result) => {
        if(err) res.status(500).send("Error fetching data");
        if(result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send("No users found");
        }
    })
})

// Update room name

app.put('/update-room-name/:room_id', (req, res) => {
    const { id, room_name } = req.body;

    const query = `
        UPDATE rooms SET room_name = ?
        WHERE id = ?
    `;

    db.query(query, [room_name, id], (err, result) => {
        if (err) return res.status(500).send("Error fetching data");
        res.status(200).send(result);
    })
})

app.listen(5000);
console.log("Working");