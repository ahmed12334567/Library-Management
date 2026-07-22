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
    },
    getUsers: async () => {
        const query = `SELECT id, username, email, role, google_user, created_at
        FROM users ORDER BY created_at DESC`
        const result = await pool.query(query)
        return result.rows
    },
    getUser: async (id) => {
        const query = `SELECT id, username, email, role, google_user, created_at
        FROM users WHERE id = $1`
        const vlaue = [id]
        const result = await pool.query(query, vlaue)
        return result.rows
    },
    deleteUser: async(id) =>{
        const query = `DELETE FROM users WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rowCount > 0;
    },
    updateUser: async(data) =>{
        const query = `UPDATE users SET role = $1
        WHERE id = $2`
        const value = [data.role, data.id]
        const result = await pool.query(query, value)
        return result.rowCount > 0;
    }
}

module.exports = user