const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const NEWS_API_KEY = "4d2ab94760354bb39521841bc926e837";
const BASE_URL = "https://newsapi.org/v2/top-headlines";
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 600 seconds (10 minutes)

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const cacheKey = `news-page-${page}`;

  // Check if data is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apiKey: NEWS_API_KEY,
        country: "us",
        page: page,
        pageSize: 10,
      },
    });

    // Cache the response data
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 429) {
        // Rate limit exceeded
        console.error("Rate limit exceeded. Please try again later.");
        const retryAfter = error.response.headers["retry-after"];
        res.status(429).json({
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
        });
      } else {
        console.error("Error fetching news:", error.message);
        res
          .status(error.response.status)
          .json({ error: error.response.data.message });
      }
    } else {
      console.error("Error fetching news:", error.message);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  }
});

module.exports = router;
