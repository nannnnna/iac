const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.find(login);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Неверно указаны имя или пароль пользователя');
        }
        const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_KEY);
        req.session.user = { userId: user.user_id, login: user.login, fullName: user.full_name, role: user.role};
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// exports.login = async (req, res) => {
//     const { login, password } = req.body;
//     try {
//         const user = await User.find(login);
//         if (!user) {
//             return res.status(401).send('Login failed: User not found.');
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             req.session.user = { id: user.id, login: user.login, role: user.role };
//             res.redirect('/dashboard');
//         } else {
//             res.status(401).send('Login failed: Incorrect username or password.');
//         }
//     } catch (err) {
//         res.status(500).send('Server error during authentication.');
//     }
// };

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

exports.register = async (req, res) => {
    console.log(req.body);
    try {
        const { fullName, login, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, login, password: hashedPassword });
        req.session.user = { userId: newUser.id, login: newUser.login, fullName: newUser.fullName  };
        console.log(newUser);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during registration');
    }
};