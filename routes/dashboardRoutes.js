const express = require('express');
const router = express.Router();
const Book = require('../models/item');
const User = require('../models/user');

router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (!req.session.user.userId) {
        console.error('User ID is undefined');
        return res.status(500).send("Internal Server Error: User ID is undefined");
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const { rows, totalItems, totalPages } = await Book.findAll({ page, limit: 20 });
        const roleIds = await User.getUserRoles(req.session.user.userId);
        const roleNames = await User.getRoleNames(roleIds);

        res.render('dashboard', {
            user: req.session.user,
            books: rows,
            totalItems: totalItems,
            totalPages: totalPages,
            roleNames: roleNames,
            currentPage: page
        });
    } catch (error) {
        console.error('Error loading books:', error);
        if (!res.headersSent) {
            res.status(500).send("Error loading the dashboard");
        }
    }
});

module.exports = router;
