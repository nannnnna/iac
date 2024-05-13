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
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Server error while creating the book: " + error.message);
    }
};
exports.getDeleteBooksPage = async (req, res) => {
    try {
        const books = await Book.findAll({});
        res.render('delete_books', {
            user: req.session.user,
            books: books.rows,
            roleNames: await User.getRoleNames(await User.getUserRoles(req.session.user.userId))
        });
    } catch (error) {
        console.error('Error loading delete page:', error);
        res.status(500).send("Error loading the delete books page.");
    }
};
exports.deleteSelectedBooks = async (req, res) => {
    try {
        const idsToDelete = Array.isArray(req.body.bookId) ? req.body.bookId : [req.body.bookId];
        await Book.deleteMultiple(idsToDelete);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting books:', error);
        res.status(500).send("Server error while deleting books.");
    }
};
exports.getBooksForEditing = async (req, res) => {
    try {
        const books = await Book.findAll({});
        res.render('edit_books_list', {
            user: req.session.user,
            books: books.rows,
            roleNames: await User.getRoleNames(await User.getUserRoles(req.session.user.userId))
        });
    } catch (error) {
        console.error('Error loading books for edit:', error);
        res.status(500).send("Error loading the edit books page.");
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.update(req.params.id, req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send("Server error while updating the book.");
    }
};
exports.editBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send('Book not found.');
        }
        res.render('edit_book', { book, user: req.session.user });
    } catch (error) {
        console.error('Error fetching book for editing:', error);
        res.status(500).send("Server error while retrieving the book for editing.");
    }
};