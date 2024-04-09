//const fetch = require('node-fetch');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLinks(url, visited = new Set(), depth = 0) {
    if (visited.has(url) || depth > 100) {
        return;
    }

    visited.add(url);

    try {
        await sleep(1000); // Attendre 1 seconde entre chaque requête
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const html = await response.text();
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
        let match;
        while ((match = linkRegex.exec(html))) {
            const link = match[2];
            if (link.startsWith('http') || link.startsWith('https')) {
                if (!visited.has(link)){
                    if (link.includes('wiflix') && link.endsWith('.html')) {
                        console.log(link);
                        await fsp.appendFile('links.txt', link + '\n').catch(console.error);
                    }
                    visited.add(link);
                }
                await getLinks(link, visited, depth + 1);
            }
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des liens de ${url}:`, error);
    }
}

async function get_normal_links(url, name){
    if (fs.existsSync(path.join(__dirname, "./links/"+ name + '.txt'))) {
        fs.unlinkSync(path.join(__dirname, "./links/"+ name + '.txt'));
    }

    const response = await fetch(url);
    const array = [];
    const html = await response.text();
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    let match;
    while ((match = linkRegex.exec(html))) {
        const link = match[2];
        if (link.startsWith('http') || link.startsWith('https')) {
            if (link.includes('wiflix') && link.endsWith('.html')) {
                array.push(link);
                await fsp.appendFile("./links/"+ name + '.txt', link + '\n').catch(console.error);
            }
        }
    }                  
}


const startingUrl = 'https://wiflix.cloud/';
// lire le fichier 29992-dune-deuxieme-partie.txt
for (const file of fs.readdirSync('./links')) {
    const filePath = path.join('./links', file);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        for (const url of data.split('\n')) {
            const segments = url.split('/');
            if (segments.length > 4) {
                const name = segments[4].split('.')[0];
                get_normal_links(url, name);
            }
        }
    } else {
        console.log(`Le fichier ${filePath} n'existe pas.`);
    }
}