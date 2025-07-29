import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity

# Load model and data
df = pd.read_csv("data/clean_data.csv")
vectorizer = joblib.load("model/vectorizer.pkl")
tfidf_matrix = joblib.load("model/tfidf_matrix.pkl")

def recommend_products(query, top_n=10):
    title_vec = vectorizer.transform([query.lower()])
    sim_scores = cosine_similarity(title_vec, tfidf_matrix).flatten()
    top_indices = sim_scores.argsort()[::-1][:top_n]
    results = df.loc[top_indices, ['ID', 'ProdID', 'Name', 'Rating', 'Brand', 'ImageURL', 'Tags']]
    return results.to_dict(orient="records")
