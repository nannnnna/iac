const express = require('express');
const roleCheck = require('../middleware/roleMiddleware');
const { getAllBooks, getBook, createBook, updateBook, deleteBook, getDashboard, getDeleteBooksPage, deleteSelectedBooks} = require('../controllers/itemController');
const router = express.Router();

router.get('/dashboard', roleCheck('ROLE_LIST_VIEW'), getDashboard);
router.get('/data_list', roleCheck('ROLE_LIST_VIEW'), getAllBooks);
router.post('/data_add', roleCheck('ROLE_ADD'), createBook);
router.get('/add_book', roleCheck('ROLE_ADD'), (req, res) => {
    res.render('add_book');
});
router.get('/delete_books', roleCheck('ROLE_DELETE'), getDeleteBooksPage);
router.post('/delete_books', roleCheck('ROLE_DELETE'), deleteSelectedBooks);

module.exports = router;
