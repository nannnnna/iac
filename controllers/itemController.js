const Book = require('../models/item');

exports.getAllBooks = async (req, res) => {
    try {
        const { page, limit, sort, filter } = req.query;
        const books = await Book.findAll({
            filter,
            sort,
            page: page || 1,
            limit: limit || 20
        });
        res.json(books);
    } catch (error) {
        res.status(500).send("Server error while retrieving books.");
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send("Book not found.");
        }
        res.json(book);
    } catch (error) {
        res.status(500).send("Server error while retrieving the book.");
    }
};

exports.createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).send("Server error while creating the book.");
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.update(req.params.id, req.body);
        res.json(updatedBook);
    } catch (error) {
        res.status(500).send("Server error while updating the book.");
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.delete(req.params.id);
        res.status(204).send("Book deleted.");
    } catch (error) {
        res.status(500).send("Server error while deleting the book.");
    }
};
