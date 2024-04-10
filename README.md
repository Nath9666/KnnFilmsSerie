# Knn Films and serie

Ce programme vise par une machine learning à conseiller des films ou des series qui serait proches de celui que l'on a bien aimé

## Utilise le KNN

Pour faire cela on utilise les plus proche voisins a affinée en fonctions de

## Données

On reprend les données d'un site de streaming assez complet [Wiflix](https://wiflix.name/)
Ou l'on fait de requetes pour recupérer les données :
- Titre original
- Date de sortie
- GENRE
- ORIGINE
- RÉALISATEUR
- ACTEURS
- Version
- Qualité
- Durée
- Synopsis

Exemple :
'titre original: Dune: Part Two ',
'Date de sortie: 2024 ',
'GENRE:  Film, Exclue, Drame, Science Fiction ',
'ORIGINE: U.S.A. ',
'RÉALISATEUR: Denis Villeneuve',
'ACTEURS: Timothée Chalamet, Zendaya, Rebecca Ferguson, Josh Brolin',
'Version: VOSTFR',
'Qualité: HDLight',
'Durée: 2 h 46 mn'

### Application des fichiers

Dans un premier temps on a devellopé [links.js](links.js) qui nous permet de recupérer et d'enregistrer les liens dans un fichiers txt dans le dossier [links](./links/)

Puis nous avons fait [automate.py](automate.py) qui nous sert à automatiser le lancement de `links.js`

Enfin on reprend tout les fichiers dans [links2](./links2/) afin de faire un fichiers txt contenant tout les liens contenu dans les fichiers en fesant attention au duplicatas. [fusion.py](fusion.py)

## Devellopement suplémentaire

faire une interface graphique avec tkinter
faire une extension google chrome pour qu'il enregistre les nouveau film que l'on veut voir
exporter le model dans un fichier
