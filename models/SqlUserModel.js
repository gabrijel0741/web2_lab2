const db = require('../db')

module.exports = class User {
    constructor(username, first_name, last_name, password) {
        this.user_id = undefined
        this.user_name = username
        this.first_name = first_name
        this.last_name = last_name
        this.password = password
    }

    static async fetchByUsername(username, password, checked) {
        let results = null
        if(checked){
            results = await dbGetUserByNameSQL(username, password)
        }
        else{
            results = await dbGetUserByNameNOSQLinj(username, password)
        }
        return results[0]
    }

}

dbGetUserByNameSQL = async (user_name, password) => {
    const sql = `SELECT user_id, user_name, first_name, last_name, password
    FROM users WHERE user_name = '${user_name}' AND password = '${password}'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetUserByNameNOSQLinj = async (user_name, password) => {
    const sql = `SELECT user_id, user_name, first_name, last_name, password
    FROM users WHERE user_name = $2 AND password = $1`;
    try {
        const result = await db.query(sql, [password, user_name]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

