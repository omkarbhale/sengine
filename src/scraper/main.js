const { sequelize } = require("../db/connect");
const Url = require("../models/Url");
const { scrape } = require("./utils/scrape");
// const { url }

const URL_MATCH_REGEX = /https.*aras\.com/
const WAIT_TIME = 500;

const run = async () => {
    await sequelize.sync();
    while (true) {
        // const url = 'http://127.0.0.1:5500/index.html';
        // // const url = 'https://www.aras.com/community/f';
        // const [subUrls, error] = await scrape(url);
        
        const url = Url.findOne({ where: { isScraped: false, errorMessage: null }});
        // const [suburls, error] = scrape(url.url);
        // if (error) {

        // }
        break;
        await new Promise((res, rej) => setTimeout(res, WAIT_TIME));
    }
}

run();
