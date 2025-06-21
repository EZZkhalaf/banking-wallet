// ./middlware/rateLimiter.js
const { Ratelimit } = require("@upstash/ratelimit");
const { Redis } = require("@upstash/redis");

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

// A wrapper to convert async middleware to standard Express middleware
function asyncMiddleware(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

const rateLimiter = async (req, res, next) => {
  const ip = req.ip ?? "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return res.status(429).json({ error: "Too many requests" });
  }

  next();
};

module.exports = asyncMiddleware(rateLimiter); // ✅ wrapped!
