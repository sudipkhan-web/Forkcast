const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  // Create a browser context with microphone permission
  const context = await browser.newContext({
    permissions: ['microphone']
  });

  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Live') || msg.text().includes('API') || msg.text().includes('assistant')) {
      console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  console.log("Navigating to http://localhost:3000/");
  await page.goto('http://localhost:3000/');
  
  // Wait for React to mount and user context to be available
  await page.waitForTimeout(2000);

  // Set local storage to skip terms gate and login
  await page.evaluate(() => {
    localStorage.setItem('forkcast_local_user_id', 'test-user-id');
    localStorage.setItem('forkcast_profile', JSON.stringify({
      hasAcceptedTerms: true,
      name: 'Test',
      preferences: {}
    }));
  });
  
  console.log("Reloading after setting auth...");
  await page.reload();
  await page.waitForTimeout(2000);

  console.log("Looking for mic button...");
  const micButton = page.locator('.fixed.bottom-24.right-6 button');
  if (await micButton.count() > 0) {
    console.log("Clicking mic button...");
    await micButton.click();
    await page.waitForTimeout(5000);
  } else {
    console.log("Mic button not found. Dumping HTML...");
    const html = await page.content();
    console.log(html.substring(0, 500));
  }

  await browser.close();
})();
