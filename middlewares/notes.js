const client = require("../redis");

exports.getNotesCache = (req, res, next) => {
  client.get(`getNotes=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {
      console.log(JSON.parse(data));
      res.json({
        notes: JSON.parse(data),
      });
    } else {
      next();
    }
  });
};
