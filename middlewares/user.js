

exports.getUserCache = (req, res, next) => {
  client.get(`getUser=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {

      res.json({
        user: JSON.parse(data),
      });
    } else {
      next();
    }
  });
};

exports.allUserCache = (req, res, next) => {
  client.get(`allUser`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {

      res.json({
        result: JSON.parse(data),
      });
    } else {
      next();
    }
  });
};

exports.getNotificationsCache = (req, res, next) => {
  client.get(`notifications=${req.user._id}`, (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (data) {

      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
