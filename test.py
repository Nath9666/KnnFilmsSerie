from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd

# Créez un TfidfVectorizer pour convertir les attributs textuels en vecteurs numériques
tfidf = TfidfVectorizer(stop_words='english')

# Lire le fichier CSV dans un DataFrame
df = pd.read_csv('movie_ratings.csv')

# Supposons que vous ayez un DataFrame pandas `df` avec les attributs 'style', 'directory', et 'actors' pour chaque film
df['content'] = df['style'] + ' ' + df['directory'] + ' ' + df['actors']
tfidf_matrix = tfidf.fit_transform(df['content'])

# Calculez la matrice de similarité
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Vous pouvez maintenant utiliser `cosine_sim` pour trouver les films les plus similaires à un film donné
# Par exemple, pour trouver les 5 films les plus similaires au film avec l'index 0:
sim_scores = list(enumerate(cosine_sim[0]))
sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
sim_scores = sim_scores[1:6]
movie_indices = [i[0] for i in sim_scores]

# Phrase pour presenter les données
print("Les 5 films les plus similaires au film '",df['video_name'].iloc[0],"' sont:")
for i in movie_indices:
    if df['video_name'].iloc[i] != df['video_name'].iloc[0]:
        print(df['video_name'].iloc[i])