import React, { useState } from 'react';
import axios from 'axios';

const ProductRecommendations = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/recommend?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 rounded w-full mb-4"
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchRecommendations} className="bg-blue-500 text-white px-4 py-2 rounded">
        Get Recommendations
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {results.map(product => (
          <div key={product.ID} className="border p-4 rounded shadow">
            <img src={product.ImageURL} alt={product.Name} className="w-full h-40 object-cover" />
            <h2 className="text-lg font-semibold mt-2">{product.Name}</h2>
            <p className="text-sm text-gray-600">Brand: {product.Brand}</p>
            <p className="text-sm text-yellow-500">Rating: {product.Rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
