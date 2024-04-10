const { Op } = require("sequelize");
const { sequelize } = require("../db/connect");
const Page = require("../models/Page");
const Url = require("../models/Url");
const { scrape } = require("./utils/scrape");
const fs = require("fs");
const path = require("path");

sequelize.options.logging = false;
const URL_MATCH_REGEX = /https.*aras\.com/
const URL_AVOID_REGEX = /login/;
const WAIT_TIME = 0;

const run = async () => {
    let shouldExit = false;
    process.on('SIGINT', () => {
        console.log('sigint detected');
        shouldExit = true;
    })

    await sequelize.sync();
    let i = (await Url.findAndCountAll({where:{isScraped:true}})).count+1;
    while (true) {
        // const transaction = await sequelize.transaction();
        const url = await Url.findOne({ where: { isScraped: false, errorMessage: null },  });
        if (url === null) {
            console.log('No url found that are not scraped');
            break;
        }
        // if (url.url.includes(".businesswire.")) {
        //     url.errorMessage = 'Not aras website';
        //     url.isScraped = true;
        //     await url.save();
        //     continue;
        // }
        
        const [suburls, content, error] = await scrape(url.url);
        if (error) {
            url.errorMessage = error.message;
            url.isScraped = true;
            await url.save({});
            continue;
        }
        
        const page = Page.build({
            url: url.id,
            content: content
        });
        await page.save({  });

        url.isScraped = true;
        url.page = page.id;
        await url.save({  });

        for (const urlString of suburls) {
            if (!urlString.match(URL_MATCH_REGEX) || urlString.match(URL_AVOID_REGEX)) {
                continue;
            }
            if (await Url.findOne({ where: { url: urlString },  }) !== null) {
                continue;
            }
            const newurl = Url.build({
                url: urlString,
                isScraped: false,
                page: null,
                parentUrl: url.id,
                errorMessage: null
            });
            await newurl.save({  });
        }
        console.log(`${i} ${url.url}`);

        if (i%500 === 0) {
            fs.copyFileSync(path.join(__dirname, "..", "..", "database.db"), path.join(__dirname, "..", "..", "backups", `database_${Date.now()}.db`));
            console.log('Database backup saved');
        }

        i += 1;
        if (shouldExit) {
            console.log('closeing sequelize connection');
            sequelize.close();
            break;
        }
        await new Promise((res, rej) => setTimeout(res, WAIT_TIME));
    }
}

const init = async () => {
    await sequelize.sync({force: true});
    const url = Url.build({
        url: 'https://www.aras.com/community/f',
        isScraped: false,
        page: null,
        parentUrl: null,
        errorMessage: null,
    });
    await url.save();
}

const quick_stats = async () => {
    const urlsScraped = (await Url.findAndCountAll({where:{isScraped: true}})).count;
    const pages = (await Page.findAndCountAll()).count;
    const urlsNotScraped = (await Url.findAndCountAll({where:{isScraped: false}})).count;
    const scrapedErrors = (await Url.findAndCountAll({
        where:{
            errorMessage: {
                [Op.not]: null,
            }
        }
    })).count;
    console.log(`Urls Scraped: ${urlsScraped}`);
    console.log(`Pages Scraped: ${pages}`);
    console.log(`URLS not yet scraped: ${urlsNotScraped}`);
    console.log(`URLS scraped errors: ${scrapedErrors}`);

    process.exit(0);
}

// quick_stats();
// init();
// init().then(() => run());
run();
