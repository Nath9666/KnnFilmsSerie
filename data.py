import csv

# Les données à écrire dans le fichier CSV
data = [
    ["user_id", "video_name", "style", "directory", "actors", "rating"],
    [1, "Dune", "Action", "Director1", "Actor1, Actor2", 4],
    [1, "Shogun", "Comedy", "Director2", "Actor3, Actor4", 3],
    [1, "Les Trois Mousquetaires: Milady", "Action", "Director1", "Actor1, Actor2", 5],
    [1, "Ninja_Kamui", "Drama", "Director3", "Actor5, Actor6", 5],
    [2, "Dune", "Action", "Director1", "Actor1, Actor2", 3],
    [2, "Shogun", "Comedy", "Director2", "Actor3, Actor4", 2],
    [2, "Ninja_Kamui", "Drama", "Director3", "Actor5, Actor6", 5],
    [3, "Dune", "Action", "Director1", "Actor1, Actor2", 4],
    [3, "Shogun", "Comedy", "Director2", "Actor3, Actor4", 1],
    [3, "Ninja_Kamui", "Drama", "Director3", "Actor5, Actor6", 5],
]

# Écriture des données dans le fichier CSV
with open('movie_ratings.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)