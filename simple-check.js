const playwright = require('@playwright/test');

async function checkPage() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to editor...');
    await page.goto('http://localhost:3000/editor', { waitUntil: 'networkidle', timeout: 60000 });

    console.log('Page loaded, getting title and content...');
    const title = await page.title();
    console.log('Page title:', title);

    // Take a screenshot to see what's on the page
    await page.screenshot({
      path: '/home/alex/dev/editor-ai/tests/screenshots/page-content.png',
      fullPage: true
    });

    // Get page content to analyze
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('Body HTML length:', bodyHTML.length);

    // Check for common selectors
    const selectors = [
      '[data-plate-editor]',
      '[role="toolbar"]',
      '.plate-editor',
      '.toolbar',
      'div[data-testid]',
      'div[role]'
    ];

    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      console.log(`${selector}: ${count} elements found`);
    }

    // Get all data attributes
    const dataElements = await page.$$eval('*[data-*]', elements =>
      elements.map(el => Array.from(el.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => attr.name)
      ).flat()
    );

    const uniqueDataAttrs = [...new Set(dataElements)];
    console.log('Data attributes found:', uniqueDataAttrs.slice(0, 20)); // First 20

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkPage();