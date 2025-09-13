const playwright = require('@playwright/test');

async function analyzeToolbar() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to editor...');
    await page.goto('http://localhost:3000/editor', { waitUntil: 'networkidle' });

    console.log('Waiting for editor to load...');
    await page.waitForSelector('[data-plate-editor]', { timeout: 30000 });

    console.log('Taking desktop screenshot...');
    await page.screenshot({
      path: '/home/alex/dev/editor-ai/tests/screenshots/toolbar-desktop-full.png',
      fullPage: true
    });

    console.log('Analyzing toolbar structure...');

    // Count visible toolbar elements
    const toolbarButtons = await page.locator('[role="toolbar"] button:visible').count();
    const toolbarGroups = await page.locator('[role="toolbar"] > *').count();

    console.log(`Found ${toolbarButtons} visible buttons in ${toolbarGroups} groups`);

    // Test responsive behavior
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'ultra-wide' }
    ];

    for (const viewport of viewports) {
      console.log(`Testing ${viewport.name} viewport...`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);

      const buttons = await page.locator('[role="toolbar"] button:visible').count();
      console.log(`${viewport.name}: ${buttons} visible buttons`);

      await page.screenshot({
        path: `/home/alex/dev/editor-ai/tests/screenshots/toolbar-${viewport.name}-responsive.png`
      });
    }

    // Check for More button
    await page.setViewportSize({ width: 1280, height: 720 });
    const moreButton = await page.locator('button:has-text("More"), [aria-label*="More"], [data-testid*="more"]').count();
    console.log(`More button present: ${moreButton > 0}`);

    // Get toolbar HTML structure for analysis
    const toolbarHTML = await page.locator('[role="toolbar"]').innerHTML();
    console.log('Toolbar structure captured');

    console.log('Analysis complete!');

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

analyzeToolbar();