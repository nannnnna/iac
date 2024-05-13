const pool = require('./config.js');
module.exports = {
    query: (text, params) => pool.query(text, params),
};
