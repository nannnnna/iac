const express = require('express');
const roleCheck = require('../middleware/roleMiddleware');
const { getAllBooks, createBook, getDashboard, getDeleteBooksPage, deleteSelectedBooks, editBook, updateBook, getBooksForEditing} = require('../controllers/itemController');
const router = express.Router();
const Book = require('../models/item');


router.get('/dashboard', roleCheck('ROLE_LIST_VIEW'), getDashboard);
router.get('/data_list', roleCheck('ROLE_LIST_VIEW'), getAllBooks);
router.post('/data_add', roleCheck('ROLE_ADD'), createBook);
router.get('/add_book', roleCheck('ROLE_ADD'), (req, res) => {
    res.render('add_book');
});
router.get('/delete_books', roleCheck('ROLE_DELETE'), getDeleteBooksPage);
router.post('/delete_books', roleCheck('ROLE_DELETE'), deleteSelectedBooks);
router.get('/edit_books', roleCheck('ROLE_EDIT'), getBooksForEditing);
router.get('/edit_book/:id', roleCheck('ROLE_EDIT'), editBook);
router.post('/update_book/:id', roleCheck('ROLE_EDIT'), updateBook);

module.exports = router;
