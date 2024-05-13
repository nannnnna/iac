const Book = require('../models/item');

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await Book.findAll({ page, limit });
        res.json(result);
    } catch (error) {
        res.status(500).send("Server error while retrieving books: " + error.message);
    }
};