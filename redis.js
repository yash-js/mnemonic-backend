const Redis = require("redis");

const redisUrl = process.env.REDIS;
const client = Redis.createClient({
  legacyMode: true,
  url: redisUrl,
});

module.exports = client;
