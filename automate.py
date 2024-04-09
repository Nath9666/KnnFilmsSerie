import subprocess
import time

import os

def count_files_in_directory(directory):
    return len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])

# Utilisation de la fonction
directory = "links2"
print(f"Il y a {count_files_in_directory(directory)} fichiers dans le repertoire {directory}.")

temp = count_files_in_directory(directory)

boucle = True

while boucle:
    for i in range(5):
        # lance la commande pour lancer le data.js
        subprocess.run(["node", "links.js"])

        # Attendre 4 secondes avant de répéter
        time.sleep(5)
    if temp == count_files_in_directory(directory):
        print("Pas de nouveaux fichiers")
        subprocess.run(["node", "links.js"])
        #boucle = False
    else:
        temp = count_files_in_directory(directory)
        print("Nouveau fichiers trouves")
        boucle = True


