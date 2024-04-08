import requests
from bs4 import BeautifulSoup

def get_links(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        links = soup.find_all("a")
        hrefs = [link.get("href") for link in links]
        return hrefs
    else:
        print("La requête a échoué avec le code", response.status_code)

# Faire une requête GET à la page
url = "https://wiflix.name/"
domaine = get_links(url)

print(domaine[0])
video = get_links(domaine[0])

series = []
films = []
autre = []

for i in video:
    if i.startswith("https://wiflix.cloud/serie-en-streaming/)"):
        series.append(i)
    elif i.startswith("https://wiflix.cloud/film-en-streaming/)"):
        films.append(i)
    else:
        autre.append(i)
    
print(series)
print(films)

