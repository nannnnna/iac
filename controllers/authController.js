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
        const roleIds = await User.getUserRoles(user.id);
        const roleNames = await User.getRoleNames(roleIds);
        req.session.user = {
            userId: user.id,
            login: user.login,
            fullName: user.full_name,
            roles: roleNames
        };
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
        console.log('Session user set:', req.session.user);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
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

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};