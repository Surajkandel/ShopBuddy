from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Load models
vectorizer = joblib.load('vectorizer.pkl')
tfidf_matrix = joblib.load('tfidf_matrix.pkl')
df = joblib.load('products_df.pkl')

app = Flask(__name__)
CORS(app)  # ✅ Enables CORS

@app.route('/recommend', methods=['GET', 'POST'])
def recommend():
    if request.method == 'GET':
        query = request.args.get('query', '').lower()
    else:
        data = request.get_json()
        query = data.get('query', '').lower()

    query_vec = vectorizer.transform([query])
    sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
    top_indices = sim_scores.argsort()[::-1][:10]
    recommendations = df.iloc[top_indices][['ID', 'ProdID', 'Name', 'Rating', 'Brand', 'ImageURL']].to_dict(orient='records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5000)
