//const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { append } = require('domutils');
const fs = require('fs');
const path = require('path');
const { domainToASCII } = require('url');

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

        data.push('titre:' + $('h1').text());
        // Utilisez le sélecteur CSS pour cibler les balises <li> dans l'élément avec la classe .mov-list
        $('.mov-list li').each((index, element) => {
            var li = $(element).text();
            li = li.split(":")
            li = li[0].toLowerCase() + ":" + li[1];
            data.push(li);
        });

        let synopsis = $('.screenshots-full').text();
        synopsis = synopsis.replace(/\n/g, '').replace(/\t/g, '').replace(":", '').split('Streaming Complet:')[1];
        data.push('synopsis:' + synopsis);
        
        const img_data = $('#posterimg').attr('src');
        
        data.push('image:' + "https://wiflix.cloud" + img_data);
        data.push('url:' + url.replace('\r', ''));

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
    if (line) { // Ajoutez cette vérification
            const parts = line.split(':');
            if (parts.length >= 2) {
                const name = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                object[name] = value;
            }
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

function chargement(i, length) {
    let progress = (i/length*100).toFixed(2);
    process.stdout.write('\r' + progress + "%");
    // barre de chargement sur la console
    process.stdout.write('[');
    for (let i = 0; i < 50; i++) {
       if (i < (progress / 2)) {
           process.stdout.write('#');
       } else {
           process.stdout.write(' ');
       }
    }
    process.stdout.write(']');
}

// Exemple d'utilisation
const url = 'https://wiflix.name/';
var domaine = [];

var links_video = [];
var films = [];
var test = [];

// Surpime les fichiers data.csv et data.json
if (fs.existsSync(path.join(__dirname, './data/data.csv'))) {
    fs.unlinkSync(path.join(__dirname, './data/data.csv'));
}

if (fs.existsSync(path.join(__dirname, './data/data.json'))) {
    fs.unlinkSync(path.join(__dirname, './data/data.json'));
}

async function main() {
    try {
        // Lire les liens à partir du fichier merged.txt
        const linksFromFile = fs.readFileSync(path.join(__dirname, 'merged.txt'), 'utf-8').split('\n');

        // Utiliser les liens du fichier au lieu de ceux récupérés à partir de la page web
        for (let i = 0; i < linksFromFile.length; i++) {
            if (!exist(linksFromFile[i], films)) {
                if (linksFromFile[i].includes("film") && linksFromFile[i].includes("html")) {
                    films.push(linksFromFile[i]);
                }
            }
        }

        for (let i = 0; i < films.length; i++) {
            test = await getData(films[i]);
            //console.log('Données récupérées:', test);
            //writeData_csv(test, 'data/data.csv');
            writeData_json(test, 'data/data.json');
            chargement(i, films.length);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite:', error);
    }
}

main();