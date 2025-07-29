import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity

# Load the saved model artifacts
vectorizer = joblib.load('vectorizer.pkl')
tfidf_matrix = joblib.load('tfidf_matrix.pkl')
df = joblib.load('products_df.pkl')

def recommend_products(query, top_n=10):
    """
    Recommends products based on a query using cosine similarity
    :param query: The query string (e.g., "mobile phone")
    :param top_n: Number of recommendations to return
    :return: A list of recommended products
    """
    # Transform the input query into the same vector space
    query_vec = vectorizer.transform([query.lower()])
    
    # Calculate cosine similarity between the input query and all products
    sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # Get the indices of the top N most similar products
    top_indices = sim_scores.argsort()[::-1][:top_n]
    
    # Return the recommended products as a dictionary
    recommended_products = df.iloc[top_indices][['ID', 'ProdID', 'Name', 'Rating', 'Brand', 'ImageURL']].to_dict(orient='records')
    return recommended_products

# Test with a sample query
query = "mobile"
recommendations = recommend_products(query)
for rec in recommendations:
    print(rec)
