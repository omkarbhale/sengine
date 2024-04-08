const http = require('https');
const { JSDOM } = require("jsdom");

const fetchHtml = async (url) => {
    return new Promise((res, rej) => {
        http.get(url, (result) => {
            if (!result.headers['content-type'].includes("text/html")) {
                throw new Error(`URL ${url} did not respond with text/html`);
            }
            const data = [];
            result.on('close', () => {
                result.content = Buffer.concat(data);
                res(result);
            });
            result.on('data', d => data.push(d));
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
        return [urls, null];
    } catch(e) {
        return [null, e.message];
    }
}

module.exports = {
    scrape
}