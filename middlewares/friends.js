const client = require("../redis");

exports.getFriendsCache = (req, res, next) => {
  client.get(`friends=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
exports.getRequestsCache = (req, res, next) => {
  client.get(`requests=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
exports.getSentRequestsCache = (req, res, next) => {
  client.get(`sentRequests=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
exports.getAllDataCache = (req, res, next) => {
  client.get(`allData=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
