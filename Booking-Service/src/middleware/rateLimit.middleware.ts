import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 50,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again after 15 minutes."
  }

});