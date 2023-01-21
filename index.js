const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const options = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(options));
app.options("*", cors(options));

app.use(cookieParser());
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

dotenv.config({
  path: "./config.env",
});

require("./db/conn");

app.use(require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/friend", require("./routes/friend"));
app.use("/notes", require("./routes/notes"));
const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
