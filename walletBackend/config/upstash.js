const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");
require("dotenv").config();

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, "60s"), // 100 requests per 60 seconds
});

module.exports = { ratelimit };
