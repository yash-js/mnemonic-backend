const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

dotenv.config({
  path: "./config.env",
});

require("./db/conn");

app.use(require("./routes/auth"));
app.use("/friend", require("./routes/friend"));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
