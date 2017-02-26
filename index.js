const stringify = require('csv-stringify');
const parse = require('csv-parse/lib/sync');
const webdriverio = require('webdriverio');
const fs = require('fs');
const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const stringifier = stringify({ headers: false });

stringifier.pipe(process.stdout);
stringifier.pipe(process.stderr);

let initialURL = '';
let currentURL = '',
    currentTitle = '';

if (process.argv.length > 2) {
    const input = fs.readFileSync(process.argv[2]).toString();
    const logs = parse(input);
    if (logs.length) {
        const lastLog = logs.pop();
        if (lastLog.length) {
            currentURL = initialURL = lastLog[0];
        }
    }
}

initialURL = initialURL || 'https://www.youtube.com/watch?v=B35YAcdkmVI';

console.error(`starting with ${initialURL}`)


let browser = webdriverio
    .remote(options)
    .init();

browser
    .url(initialURL)
    .then(function() {
        checkPage();
    });

function checkPage() {
    Promise.all([
        browser.getUrl(),
        browser.getTitle(),
        getDuration()
    ]).then(([url, title, duration]) => {
        if (url !== currentURL) {
            stringifier.write([url, title, duration, new Date().toString()]);
            currentURL = url;
            currentTitle = title;
        }
        setTimeout(checkPage, 5000);
    }).catch(err => {
        console.error(err);
        cleanUp();
    })
}

function cleanUp() {
    console.error("CLEANING UP....")
    browser.endAll()
        .then(() => {
            console.error("DONE");
            process.exit();
        });
}

function getDuration() {
    return browser
        .$('.ytp-time-duration')
        .getText();
}

process.on('SIGINT', cleanUp);
