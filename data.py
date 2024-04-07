import requests
from bs4 import BeautifulSoup

# Faire une requête GET à la page
url = "https://wiflix.name/"
response = requests.get(url)

# Vérifier si la requête a réussi
if response.status_code == 200:
    # Analyser le contenu HTML de la page
    soup = BeautifulSoup(response.content, "html.parser")

    # Exemple : Extraire tous les liens de la page
    links = soup.find_all("a")
    print(links[0].get("href"))
    response = requests.get(links[0].get("href"))
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        links = soup.find_all("a")
        #TODO: Extraire tout les film et serie via une boucle recursive, et les stocker dans une liste
        for link in links:
            print(link.get("href"))
else:
    print("La requête a échoué avec le code", response.status_code)

#TODO: faire un object avec les info que l'on veut stocker