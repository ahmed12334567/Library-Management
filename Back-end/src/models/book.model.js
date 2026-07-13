const pool = require("../config/db")

const book = {
    createBook: async (data) => {
        const query = `INSERT INTO books(title, author, isbn, price, stock, description, categorie_id)
        VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`
        const values = [
            data.title,
            data.author,
            data.isbn,
            data.price,
            data.stock,
            data.description,
            data.categorie_id
        ]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    getAllBooks: async () => {
        const query = `SELECT title, author, price, stock, description  FROM books`
        const result = await pool.query(query)
        return result.rows[0]
    },
    getBookById: async (id) => {
        const query = `SELECT title, author, price, stock, description FROM books WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rows
    },
    getBookByCategorie: async (categorie_id) => {
        const query = `SELECT title, author, price, stock, description FROM books WHERE categorie_id = $1`
        const value = [categorie_id]
        const result = await pool.query(query, value)
        return result.rows
    },
    updateBookById: async (data) => {
        const query = `UPDATE books SET title = $1 , author = $2, isbn = $3, 
     price = $4, stock = $5, description = $6, categorie_id = $7 WHERE id = $8
     RETURNING *`
        const values = [
            data.title,
            data.author,
            data.isbn,
            data.price,
            data.stock,
            data.description,
            data.categorie_id,
            data.id
        ]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    deleteBookById: async (id) =>{
        const query = `DELETE FROM books WHERE id = $1
        RETURNING *`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rows[0]
    }
}
module.exports = book