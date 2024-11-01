const rateLimit = require("express-rate-limit");

const eventRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: "You can only create 5 events per hour. Try again later."
});

module.exports = eventRateLimit;