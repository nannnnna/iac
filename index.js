const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const Book = require('./models/item');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});

app.get('/dashboard', async (req, res) => {  // Обратите внимание на ключевое слово async здесь
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const books = await Book.findAll({});
        res.render('dashboard', { user: req.session.user, books: books });
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).send("Error loading the dashboard");
    }
    res.send(`Welcome to the Dashboard, ${req.session.user.fullName}!`);
});

app.use(authRoutes);
app.use('/api', itemRoutes);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
