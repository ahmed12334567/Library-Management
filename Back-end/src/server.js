const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors());

const authRoutes = require("./routes/auth.route")
app.use("/api/v1/auth", authRoutes)

const PORT = 3000 || process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
