const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json())
app.use(cors());
app.use(httpLogger)
const authRoutes = require("./routes/auth.route")
app.use("/api/v1/auth", authRoutes)

const bookRoutes = require("./routes/book.route")
app.use("/api/v1/books", bookRoutes)

const borrowBookRoute = require("./routes/borrowedBook.route")
app.use("/api/v1/borrow", borrowBookRoute)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("server runner on ", PORT);
  
});
const { handleError } = require("./middleware/error.middleware")
app.use(handleError)