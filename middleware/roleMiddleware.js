function roleCheck(requiredRole) {
    return (req, res, next) => {
        const { user } = req.session;
        if (!user || !user.roles.includes(requiredRole)) {
            return res.status(403).send('Access denied. Insufficient permissions.');
        }
        next();
    };
}

module.exports = roleCheck;

