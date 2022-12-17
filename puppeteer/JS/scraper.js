const puppeteerBrowser = require('./puppeteer/JS/initBrowser');

async function scraper(url, outcomesXpath, oddsXpath){
  const browser = puppeteerBrowser.start()
  let page = await browser.newPage();

  await page
  .setViewport({
    width: 2560, height: 1440
  });

  await page
  .goto(
    url, {
    waitUntil: "networkidle2",
  });

  let outcomeValues = await page.$$eval(outcomesXpath, outcomes => {
    return outcomes.map(outcome => outcome.textContent);
  });

  let oddsValues = await page.$$eval(oddXpath, odds => {
    return odds.map(odd => odd.textContent);
  });

  return {
    outcomes: outcomeValues,
    odds: oddsValues
  }

}
