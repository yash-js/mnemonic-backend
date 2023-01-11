const mongoose = require("mongoose");

const db = process.env.DB
mongoose.set("strictQuery", false);

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB CONNECTED"))
.catch(err => console.log(err))