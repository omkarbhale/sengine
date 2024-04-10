const http = require('https');
const { JSDOM } = require("jsdom");

const fetchHtml = async (url) => {
    return new Promise((res, rej) => {
        http.get(url, (result) => {
            if (!result.headers['content-type'] || !result.headers['content-type'].includes("text/html")) {
                rej(`URL ${url} did not respond with text/html`);
            }
            const data = [];
            result.on('close', () => {
                result.content = Buffer.concat(data);
                res(result);
            });
            result.on('data', d => data.push(d));
            result.on('error', err => {
                rej(err);
            });
        });
    })
}

const fetchUrlsFromContent = (url, content) => {
    const dom = new JSDOM(content);
    const hrefs = [
        ...dom.window.document.querySelectorAll("a")
    ].map(anchorElement => anchorElement.href)
    .map(href => new URL(href, url).href);
    return hrefs;
}

const scrape = async (url) => {
    try {
        const result = await fetchHtml(url);
        const urls = fetchUrlsFromContent(url, result.content);
        if (result.content === null || result.content.length === 0) {
            throw new Error("Result content was null kinda");
        }
        return [urls, result.content, null];
    } catch(e) {
        return [null, null, e];
    }
}

module.exports = {
    scrape
}