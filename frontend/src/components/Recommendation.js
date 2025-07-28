import React, { useState } from 'react';
import axios from 'axios';

const Recommendation = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/recommend', { query });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      alert("Failed to fetch recommendations. Is the Flask backend running?");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🔍 Product Recommendations</h2>
      <div style={styles.searchBox}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a product keyword (e.g., mobile)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.button} onClick={handleSearch}>
          Get Recommendations
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {products.length > 0 ? (
            products.map((prod, index) => (
              <div key={index} style={styles.card}>
                <img
                  src={prod.ImageURL?.split('|')[0].trim()}
                  alt={prod.Name}
                  style={styles.image}
                />
                <h4>{prod.Name}</h4>
                <p><strong>Brand:</strong> {prod.Brand}</p>
                <p><strong>Rating:</strong> {prod.Rating}</p>
              </div>
            ))
          ) : (
            <p>No recommendations yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  searchBox: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    marginBottom: '0.5rem',
  },
};

export default Recommendation;
