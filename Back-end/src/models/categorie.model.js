const pool = require("../config/db")

const categorie = {
    getcategories: async () => {
        const query = `SELECT 
                        categories.id AS categorieid, 
                        categories.name AS categorie,
                        COUNT(books.id)::INTEGER AS total_books
                        FROM categories
                        LEFT JOIN books 
                        ON categories.id = books.categorie_id
                        GROUP BY 
                            categories.id, 
                            categories.name
                        ORDER BY 
                            categorieid`
        const result = await pool.query(query)
        return result.rows
    },
    existCtegorieByName: async (name) => {
        const query = `SELECT name FROM categories 
        WHERE name = $1`
        const value = [name]
        const result = await pool.query(query, value)
        return result.rows[0]
    },
    existCtegorieById: async (id) => {
        const query = `SELECT name FROM categories 
        WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rows[0]
    },
    addcategorie: async (name) => {
        const query = `INSERT INTO categories(name) VALUES($1)
        RETURNING *`
        const value = [name]
        const result = await pool.query(query, value)
        return result.rows
    },
    deleteCategorie: async(id) =>{
        const query = `DELETE FROM categories WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rowCount > 0
    }
}

module.exports = categorie