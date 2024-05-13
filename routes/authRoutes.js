const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});
router.post('/login', authController.login);
router.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'));
});
router.post('/register', authController.register);

module.exports = router;
