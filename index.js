const express = require("express");
const app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors');

app.use(express.json())
app.use(cookieParser())
app.use(cors());

dotenv.config({
    path: "./config.env"
})

require('./db/conn')

app.use(require("./routes/auth"))

const port = process.env.PORT

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));