const express = require('express');
const roleCheck = require('../middleware/roleMiddleware');
const { getAllBooks, getBook, createBook, updateBook, deleteBook, getDashboard} = require('../controllers/itemController');
const router = express.Router();

router.get('/dashboard', roleCheck('ROLE_LIST_VIEW'), getDashboard);

router.get('/data_list', roleCheck('ROLE_LIST_VIEW'), getAllBooks);
// router.get('/books/:id', getBook);
// router.post('/books', createBook);
// router.put('/books/:id', updateBook);
// router.delete('/books/:id', deleteBook);

module.exports = router;
