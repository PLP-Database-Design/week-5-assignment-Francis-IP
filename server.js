// Initialize dependencies
const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
    if (err) {
        return console.log("Error connecting to the mysql2 db:", err);
    }
    console.log("Connected to mysql2 successfully as id:", db.threadId);
});

// Define Routes

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving patients' });
        }
        res.json(results);
    });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving providers' });
        }
        res.json(results);
    });
});

// Question 3: Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
    const { firstName } = req.params;
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving patients' });
        }
        res.json(results);
    });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving providers' });
        }
        res.json(results);
    });
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Server started successfully! ON');
});

// Listen to the server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
