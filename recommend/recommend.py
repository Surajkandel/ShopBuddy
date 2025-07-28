import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Load and prepare data
df = pd.read_csv('/home/dhakalkiran/ShopBuddy/recommend/clean_data.csv')
df = df.fillna("")
df = df.reset_index(drop=True)

# Vectorize the Tags column
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_df=0.8,
    min_df=5,
    ngram_range=(1, 2)
)
tfidf_matrix = vectorizer.fit_transform(df['Tags'])

# Save model artifacts
joblib.dump(vectorizer, 'vectorizer.pkl')
joblib.dump(tfidf_matrix, 'tfidf_matrix.pkl')
joblib.dump(df, 'products_df.pkl')

print("✅ Vectorizer, TF-IDF matrix, and product DataFrame saved to 'model/'")
