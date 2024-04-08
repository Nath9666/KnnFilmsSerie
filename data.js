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

// Exemple d'utilisation
const url = 'https://wiflix.name/';
var domaine = [] 
getLinks(url)
    .then(links => {
        console.log('Liens récupérés:', links);
        domaine = links
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });

console.log(domaine)