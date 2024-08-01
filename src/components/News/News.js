import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";

const News = () => {
  const [articles, setArticles] = useState([]);
  const apiKey = "4d2ab94760354bb39521841bc926e837";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
        );
        setArticles(response.data.articles);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Retry after a delay (exponential backoff example)
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
          fetchNews(); // retry fetching news
        } else {
          console.error("Error fetching news articles:", error);
        }
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <h2>Latest News</h2>
      <div className="news-list">
        {articles.map((article, index) => (
          <NewsItem key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default News;
