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

        data.push('URL:' + url);

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
function writeData_csv(data, filename) {
    const fs = require('fs');
    const path = require('path');
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;

    const csvData = {};
    data.forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            csvData[name] = value;
        }
    });

    const csvWriter = createCsvWriter({
        path: path.join(__dirname, filename),
        header: Object.keys(csvData).map(key => ({id: key, title: key})),
        append: true // Ajoute les nouvelles données aux données existantes
    });

    csvWriter.writeRecords([csvData]);
}

function writeData_json(data, filename) {
    const fs = require('fs');
    const path = require('path');

    const jsonData = {};
    const object = {};
    data.forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            object[name] = value;
        }
    });
    name_object = data[data.length-1].split('//')[1].split('/')[2].split('.')[0];
    jsonData[name_object] = object;

    // Lire les données existantes
    let existingData = {};
    if (fs.existsSync(path.join(__dirname, filename))) {
        existingData = JSON.parse(fs.readFileSync(path.join(__dirname, filename)));
    }

    // Ajouter les nouvelles données aux données existantes
    const combinedData = {...existingData, ...jsonData};

    fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(combinedData, null, 2));
}

// Exemple d'utilisation
const url = 'https://wiflix.name/';
var domaine = [];

var links_video = [];
var films = [];
var test = [];

// Surpime les fichiers data.csv et data.json
const fs = require('fs');
const path = require('path');
if (fs.existsSync(path.join(__dirname, './data/data.csv'))) {
    fs.unlinkSync(path.join(__dirname, './data/data.csv'));
}

if (fs.existsSync(path.join(__dirname, './data/data.json'))) {
    fs.unlinkSync(path.join(__dirname, './data/data.json'));
}

async function main() {
    try {
        domaine = await getLinks(url);
        console.log('Liens récupérés:', domaine);
        links_video = await getLinks(domaine[0]);
        for (let i = 0; i < links_video.length; i++) {
            if (!exist(links_video[i], films)) {
                if (links_video[i].includes("film") && links_video[i].includes("html")) {
                    films.push(links_video[i]);
                }
            }
        }
        //console.log('Liens de films récupérés:', films);
        for (let i = 0; i < films.length; i++) {
            test = await getData(films[i]);
            console.log('Données récupérées:', test);
            writeData_csv(test, 'data/data.csv');
            writeData_json(test, 'data/data.json');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite:', error);
    }
}

main();