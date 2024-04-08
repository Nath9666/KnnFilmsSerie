//const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs').promises;

async function getLinks(url, visited = new Set()) {
    if (visited.has(url)) {
        return [];
    }

    visited.add(url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const links = [];

        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link && (link.startsWith('http') || link.startsWith('https'))) {
                if (!visited.has(link) && link.includes('wiflix') && link.endsWith('.html')) {
                    links.push(link);
                }
            }
        });

        return links;
    } catch (error) {
        console.error(`Erreur lors de la récupération des liens de ${url}:`, error);
        return [];
    }
}

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const data = [];

        $('.mov-list li').each((index, element) => {
            const li = $(element).text();
            data.push(li);
        });

        data.push('URL:' + url);

        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données de ${url}:`, error);
        return [];
    }
}

async function writeData(data, filename) {
    const jsonData = {};
    data.forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            jsonData[name] = value;
        }
    });

    await fs.appendFile(filename, JSON.stringify(jsonData, null, 2) + '\n').catch(console.error);
}

const startingUrl = 'https://wiflix.cloud/';
const visited = new Set();
const filename = 'data.json';

async function main() {
    const links = await getLinks(startingUrl, visited);
    for (const link of links) {
        const data = await getData(link);
        await writeData(data, filename);
    }
}

main().catch(console.error);