const knexConfig = require('../knexfile').development;  // Убедитесь, что путь правильный
const knex = require('knex')(knexConfig);

class User {
    static async find(login) {
        const user = await knex('users').where('login', login).first();
        return user;
    }

    static async create({ fullName, login, password }) {
        const [newUser] = await knex('users').insert({
            full_name: fullName,
            login: login,
            password: password
        }).returning('*');
        return newUser;
    }

    static async getUserRoles(userId) {
        const user = await knex('users').select('*').where('id', userId).first();
        const roles = [];
        console.log(userId)
        Object.keys(user).forEach(key => {
            if (key.startsWith('role_') && user[key] === true) {
                roles.push(parseInt(key.split('_')[1]));
            }
        });
        console.log("Roles:", roles)
        return roles;
    }

    static async getRoleNames(roleIds) {
        const roles = await knex('roles').select('name').whereIn('id', roleIds);
        return roles.map(role => role.name);
    }
}

module.exports = User;
