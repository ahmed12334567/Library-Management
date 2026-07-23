const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json())
app.use(cors());
const authRoutes = require("./routes/auth.route")
app.use("/api/v1/auth", authRoutes)

const bookRoutes = require("./routes/book.route")
app.use("/api/v1/books", bookRoutes)

const borrowBookRoute = require("./routes/borrowedBook.route")
app.use("/api/v1/borrow", borrowBookRoute)

const dashboardRoute = require("./routes/dashboard.route")
app.use("/api/v1/dashboard", dashboardRoute)

const categoriesRoute = require("./routes/categories.routes")
app.use("/api/v1/categories", categoriesRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("server runner on ", PORT);
  
});
const { handleError } = require("./middleware/error.middleware")
app.use(handleError)