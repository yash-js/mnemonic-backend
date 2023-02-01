const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const client = require("./redis");
dotenv.config({
  path: "./config.env",
});

require("./db/conn");

client.connect().then(() => {
  console.log("REDIS CONNECTED");
});

const CLIENT_URL =  process.env.CLIENT_URL

const options = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const secret = process.env.JWT_SECRET;

app.use(cors(options));
app.options("*", cors(options));

app.use(cookieParser());
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  session({
    key: "user",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      maxAge: 86400000,
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.user && req.cookies.user) {
    res.clearCookie("user");
    next();
  } else {
    next();
  }
});
app.use(require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/friend", require("./routes/friend"));
app.use("/notes", require("./routes/notes"));
const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
