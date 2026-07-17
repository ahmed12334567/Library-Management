const pool = require("../config/db")

const user = {
    createUser: async (data) => {
        const query = `INSERT INTO users(username, email, password, google_user)
        VALUES($1, $2, $3, $4)
        RETURNING *;`
        const values = [
            data.username,
            data.email,
            data.password,
            data.googleUser
        ]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    findUserByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = $1`
        const value = [email]
        const result = await pool.query(query, value)
        return result.rows[0]
    }
}

module.exports = user