const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log("Navigating to local site...");
  await page.goto('http://localhost:4173/AI-Emergency-Response-Assistant/', { waitUntil: 'networkidle2' });

  console.log("Waiting for app to load...");
  await page.waitForTimeout(2000);

  // Click login
  console.log("Clicking login...");
  const loginButtons = await page.$$('button');
  for (const btn of loginButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Control-Room Operator')) {
      await btn.click();
      break;
    }
  }

  await page.waitForTimeout(2000);
  console.log("Current URL:", page.url());

  await browser.close();
  console.log("Done.");
})();
