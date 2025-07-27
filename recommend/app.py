from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class RecommendationEngine:
    def __init__(self):
        self.df = None
        self.tfidf_matrix = None
        self.vectorizer = None
        self.load_data()
    
    def load_data(self):
        """Load and preprocess product data"""
        try:
            # Try to load from CSV first
            if os.path.exists('products.csv'):
                self.df = pd.read_csv('products.csv')
            else:
                # Create sample data if CSV doesn't exist
                self.create_sample_data()
            
            self.preprocess_data()
            print(f"Loaded {len(self.df)} products")
        except Exception as e:
            print(f"Error loading data: {e}")
            self.create_sample_data()
    
    def create_sample_data(self):
        """Create sample product data for testing"""
        sample_data = {
            'id': [1, 2, 3, 4, 5, 6, 7, 8],
            'title': [
                'iPhone 14 Pro',
                'Samsung Galaxy S23',
                'iPad Air',
                'MacBook Pro',
                'AirPods Pro',
                'Samsung Buds',
                'Dell Laptop',
                'Google Pixel 7'
            ],
            'category': [
                'smartphone', 'smartphone', 'tablet', 'laptop', 
                'headphones', 'headphones', 'laptop', 'smartphone'
            ],
            'tags': [
                'apple,premium,5g,camera',
                'samsung,android,5g,camera',
                'apple,tablet,productivity',
                'apple,laptop,professional,m2',
                'apple,wireless,noise-cancelling',
                'samsung,wireless,android',
                'dell,laptop,business,windows',
                'google,android,camera,ai'
            ],
            'price': [999, 899, 599, 1999, 249, 149, 1299, 699],
            'description': [
                'Latest iPhone with advanced camera system',
                'Flagship Android phone with great display',
                'Versatile tablet for work and creativity',
                'Powerful laptop for professionals',
                'Premium wireless earbuds with ANC',
                'Great wireless earbuds for Samsung users',
                'Business laptop with reliable performance',
                'AI-powered camera phone from Google'
            ]
        }
        self.df = pd.DataFrame(sample_data)
        # Save sample data to CSV
        self.df.to_csv('products.csv', index=False)
        print("Created sample product data")
    
    def preprocess_data(self):
        """Preprocess data for recommendations"""
        # Combine text features for better similarity calculation
        self.df['combined_features'] = (
            self.df['title'] + ' ' + 
            self.df['category'] + ' ' + 
            self.df['tags'].str.replace(',', ' ') + ' ' +
            self.df['description']
        )
        
        # Create TF-IDF matrix
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=1000,
            ngram_range=(1, 2)
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined_features'])
    
    def get_content_based_recommendations(self, product_id, num_recommendations=5):
        """Get content-based recommendations using TF-IDF and cosine similarity"""
        try:
            # Find product index
            product_idx = self.df[self.df['id'] == product_id].index[0]
            
            # Calculate cosine similarity
            cosine_sim = cosine_similarity(
                self.tfidf_matrix[product_idx:product_idx+1], 
                self.tfidf_matrix
            ).flatten()
            
            # Get similarity scores
            sim_scores = list(enumerate(cosine_sim))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            # Get top recommendations (excluding the product itself)
            recommendations = []
            for idx, score in sim_scores[1:num_recommendations+1]:
                product = self.df.iloc[idx]
                recommendations.append({
                    'id': int(product['id']),
                    'title': product['title'],
                    'category': product['category'],
                    'price': float(product['price']),
                    'tags': product['tags'].split(','),
                    'similarity_score': float(score),
                    'description': product['description']
                })
            
            return recommendations
        except Exception as e:
            print(f"Error in recommendations: {e}")
            return []
    
    def get_category_based_recommendations(self, category, exclude_id=None, num_recommendations=5):
        """Get recommendations based on category"""
        category_products = self.df[self.df['category'] == category]
        
        if exclude_id:
            category_products = category_products[category_products['id'] != exclude_id]
        
        # Sort by price (you can change this logic)
        category_products = category_products.sort_values('price')
        
        recommendations = []
        for _, product in category_products.head(num_recommendations).iterrows():
            recommendations.append({
                'id': int(product['id']),
                'title': product['title'],
                'category': product['category'],
                'price': float(product['price']),
                'tags': product['tags'].split(','),
                'description': product['description']
            })
        
        return recommendations

# Initialize recommendation engine
rec_engine = RecommendationEngine()

@app.route('/api/recommend/<int:product_id>', methods=['GET'])
def get_recommendations(product_id):
    """Get content-based recommendations for a product"""
    try:
        num_recs = request.args.get('limit', 3, type=int)
        recommendations = rec_engine.get_content_based_recommendations(product_id, num_recs)
        
        if not recommendations:
            return jsonify({'error': 'Product not found or no recommendations available'}), 404
        
        return jsonify({
            'product_id': product_id,
            'recommendations': recommendations,
            'total': len(recommendations)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend/category/<category>', methods=['GET'])
def get_category_recommendations(category):
    """Get recommendations by category"""
    try:
        exclude_id = request.args.get('exclude', type=int)
        num_recs = request.args.get('limit', 5, type=int)
        
        recommendations = rec_engine.get_category_based_recommendations(
            category, exclude_id, num_recs
        )
        
        return jsonify({
            'category': category,
            'recommendations': recommendations,
            'total': len(recommendations)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Get all products"""
    try:
        products = []
        for _, product in rec_engine.df.iterrows():
            products.append({
                'id': int(product['id']),
                'title': product['title'],
                'category': product['category'],
                'price': float(product['price']),
                'tags': product['tags'].split(','),
                'description': product['description']
            })
        
        return jsonify({
            'products': products,
            'total': len(products)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Recommendation API is running',
        'products_loaded': len(rec_engine.df) if rec_engine.df is not None else 0
    })

if __name__ == '__main__':
    print("Starting Recommendation API...")
    print("Available endpoints:")
    print("- GET /api/recommend/<product_id>")
    print("- GET /api/recommend/category/<category>")
    print("- GET /api/products")
    print("- GET /api/health")
    app.run(debug=True, port=5001)  # Using port 5001 to avoid conflicts