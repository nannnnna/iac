const Book = require('../models/item');
const User = require('../models/user');

exports.getDashboard = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const sort = {
            column: req.query.sort_column || 'id',
            direction: req.query.sort_direction || 'asc'
        };
        const { rows, totalItems, totalPages } = await Book.findAll({ page, limit, sort, search });
        const roleIds = await User.getUserRoles(req.session.user.userId);
        const roleNames = await User.getRoleNames(roleIds);

        res.render('dashboard', {
            user: req.session.user,
            books: rows,
            totalItems: totalItems,
            totalPages: totalPages,
            roleNames: roleNames,
            currentPage: page,
            sort: sort,
            searchQuery: search

        });
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).send("Error loading the dashboard");
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sort = req.query.sort ? { column: req.query.sort_column, direction: req.query.sort_direction } : undefined;

        const result = await Book.findAll({ page, limit, sort });
        res.json(result);
    } catch (error) {
        res.status(500).send("Server error while retrieving books: " + error.message);
    }
};
exports.createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).send("Server error while creating the book: " + error.message);
    }
};