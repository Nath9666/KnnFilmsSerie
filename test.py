from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Données d'entraînement
X_train = [[1, 2], [2, 3], [3, 1], [6, 5], [7, 7], [8, 6]]
y_train = ['chat', 'chat', 'chat', 'chien', 'chien', 'chien']

# Données de test
X_test = [[4, 4], [5, 3], [2, 1], [7, 8]]
y_test = ['chat', 'chat', 'chien', 'chien']

# Création du classifieur KNN
knn = KNeighborsClassifier(n_neighbors=3)

# Entraînement du modèle
knn.fit(X_train, y_train)

# Prédiction sur les données de test
y_pred = knn.predict(X_test)
print("Prédictions : ", y_pred)

# Calcul de la précision
accuracy = accuracy_score(y_test, y_pred)
print("Précision : ", accuracy)