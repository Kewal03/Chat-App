// newsService.js

const axios = require("axios");

const fetchNews = async (apiKey) => {
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Retry after a delay (exponential backoff example)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      return fetchNews(apiKey); // retry fetching news
    } else {
      throw error;
    }
  }
};

module.exports = { fetchNews };
