import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import summaryApi from "../common";
import SearchResult from "./SearchResult";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchSearchProducts = async () => {
    const query = new URLSearchParams(location.search).get("q");
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`${summaryApi.searchProduct.url}?q=${query}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data || []);
        setRecommendations(result.recommendations || []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchProducts();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchResult loading={loading} data={data} recommendations={recommendations} />
    </div>
  );
};

export default SearchPage;