const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  const page = await browser.newPage();
  const errors = [];
  const consoleLogs = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => consoleLogs.push(msg.text()));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  await page.click('.fixed.bottom-24.right-6 button');
  await page.waitForTimeout(4000);

  console.log("Errors:", errors);
  console.log("Console Logs:", consoleLogs);
  await browser.close();
})();
