//const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Fonction pour récupérer les liens d'une page web
async function getLinks(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const links = [];

        // Utilisez le sélecteur CSS pour cibler les balises <a> contenant les liens
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
        });

        return links;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des liens:', error);
        return [];
    }
}

async function getData(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const data = [];

        // Utilisez le sélecteur CSS pour cibler les balises <li> dans l'élément avec la classe .mov-list
        $('.mov-list li').each((index, element) => {
            const li = $(element).text();
            data.push(li);
        });

        return data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
        return [];
    }
}

function exist(url, list){
    for (let i = 0; i < list.length; i++) {
        if (list[i] == url) {
            return true;
        }
    }
    return false;
}

// Ecris les données dans un fichier csv
function writeData(data, filename) {
    const fs = require('fs');
    const path = require('path');

    const ws = fs.createWriteStream(path.join(__dirname, filename))
    ws.write('Name,Value\n');
    data.forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const columnA = parts[0].trim();
            const columnB = parts.slice(1).join(':').trim();
            ws.write(`"${columnA}","${columnB}"\n`);
        }
    });
    ws.end();
}

// Exemple d'utilisation
const url = 'https://wiflix.name/';
var domaine = [];

var links_video = [];
var films = [];
var test = [];

async function main() {
    try {
        domaine = await getLinks(url);
        console.log('Liens récupérés:', domaine);
        links_video = await getLinks(domaine[0]);
        for (let i = 0; i < links_video.length; i++) {
            if (!exist(links_video[i], films)) {
                if (links_video[i].includes("film")) {
                    films.push(links_video[i]);
                }
            }
        }
        //console.log('Liens de films récupérés:', films);
        test = await getData(films[0]);
        console.log('Données récupérées:', test);
        writeData(test, 'data.csv');
    } catch (error) {
        console.error('Une erreur s\'est produite:', error);
    }
}

main();