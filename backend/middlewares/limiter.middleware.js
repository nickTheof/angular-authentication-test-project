const rateLimit = require("express-rate-limit");

const WINDOW_MINUTES = process.env.RATE_LIMIT_WINDOW_MINUTES || 15;
const MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS || 100;

const limiter = rateLimit({
  windowMs: WINDOW_MINUTES * 60 * 1000,
  limit: MAX_REQUESTS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.email || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: `Too many requests. Limit: ${MAX_REQUESTS} per ${WINDOW_MINUTES} minutes.`,
    });
  },
});

module.exports = limiter;
