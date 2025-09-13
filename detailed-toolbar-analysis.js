const playwright = require('@playwright/test');

async function analyzeToolbar() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to editor...');
    await page.goto('http://localhost:3000/editor', { waitUntil: 'networkidle', timeout: 60000 });

    console.log('Page loaded successfully!');

    // Take full page screenshot for desktop
    await page.screenshot({
      path: '/home/alex/dev/editor-ai/tests/screenshots/desktop-full-view.png',
      fullPage: true
    });

    // Focus on toolbar area
    const toolbar = page.locator('[role="toolbar"]');
    await toolbar.screenshot({
      path: '/home/alex/dev/editor-ai/tests/screenshots/toolbar-desktop-detailed.png'
    });

    console.log('Analyzing toolbar structure...');

    // Count all toolbar buttons
    const allButtons = await page.locator('[role="toolbar"] button').count();
    const visibleButtons = await page.locator('[role="toolbar"] button:visible').count();
    console.log(`Total buttons: ${allButtons}, Visible: ${visibleButtons}`);

    // Analyze button groups by examining toolbar structure
    const toolbarHTML = await toolbar.innerHTML();

    // Count separator elements
    const separators = await page.locator('[role="toolbar"] .separator, [role="toolbar"] hr, [role="toolbar"] [data-orientation="vertical"]').count();
    console.log(`Visual separators found: ${separators}`);

    // Check for "More" button
    const moreButtonSelectors = [
      'button:has-text("More")',
      '[aria-label*="More"]',
      '[aria-label*="more"]',
      'button:has([data-icon="more"])',
      'button:has([data-icon="dots"])'
    ];

    let moreButtonFound = false;
    for (const selector of moreButtonSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`More button found with selector: ${selector}`);
        moreButtonFound = true;
        break;
      }
    }

    if (!moreButtonFound) {
      console.log('No "More" button detected');
    }

    // Test responsive behavior
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'ultra-wide' }
    ];

    const responsiveResults = {};

    for (const viewport of viewports) {
      console.log(`\\nTesting ${viewport.name} (${viewport.width}x${viewport.height})...`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000); // Allow responsive changes

      const buttons = await page.locator('[role="toolbar"] button:visible').count();
      const toolbarWidth = await page.locator('[role="toolbar"]').boundingBox();

      // Check for More button in this viewport
      let hasMoreButton = false;
      for (const selector of moreButtonSelectors) {
        if (await page.locator(selector).count() > 0) {
          hasMoreButton = true;
          break;
        }
      }

      responsiveResults[viewport.name] = {
        visibleButtons: buttons,
        hasMoreButton,
        toolbarWidth: toolbarWidth?.width || 0
      };

      console.log(`  - Visible buttons: ${buttons}`);
      console.log(`  - Has More button: ${hasMoreButton}`);
      console.log(`  - Toolbar width: ${toolbarWidth?.width || 'unknown'}px`);

      // Take screenshot for this viewport
      await page.screenshot({
        path: `/home/alex/dev/editor-ai/tests/screenshots/toolbar-${viewport.name}-responsive.png`
      });
    }

    // Reset to desktop for final analysis
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Test contextual behavior
    console.log('\\nTesting contextual toolbar behavior...');

    // Click in editor and type some text
    await page.click('body'); // Click somewhere to focus
    await page.keyboard.type('Test text for analysis');
    await page.keyboard.press('Control+a'); // Select all text
    await page.waitForTimeout(500);

    const buttonsWithSelection = await page.locator('[role="toolbar"] button:visible').count();
    console.log(`Buttons with text selected: ${buttonsWithSelection}`);

    const contextualChange = buttonsWithSelection !== responsiveResults.desktop.visibleButtons;
    console.log(`Contextual toolbar changes: ${contextualChange}`);

    // Get detailed button information
    console.log('\\nDetailed button analysis...');
    const buttonDetails = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('[role="toolbar"] button:visible'));
      return buttons.map((btn, index) => {
        const rect = btn.getBoundingClientRect();
        return {
          index,
          text: btn.textContent?.trim() || '',
          ariaLabel: btn.getAttribute('aria-label') || '',
          title: btn.getAttribute('title') || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          hasIcon: btn.querySelector('svg') ? true : false
        };
      });
    });

    console.log('Button details:', JSON.stringify(buttonDetails.slice(0, 10), null, 2)); // First 10 buttons

    // Analyze visual grouping
    console.log('\\nAnalyzing visual grouping...');
    const groupAnalysis = await page.evaluate(() => {
      const toolbar = document.querySelector('[role="toolbar"]');
      if (!toolbar) return null;

      const children = Array.from(toolbar.children);
      return children.map((child, index) => {
        const rect = child.getBoundingClientRect();
        const style = window.getComputedStyle(child);
        return {
          index,
          tagName: child.tagName,
          className: child.className,
          marginLeft: style.marginLeft,
          marginRight: style.marginRight,
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
          width: Math.round(rect.width),
          childCount: child.children.length
        };
      });
    });

    console.log('Group analysis:', JSON.stringify(groupAnalysis, null, 2));

    // Final summary
    console.log('\\n=== TOOLBAR ANALYSIS SUMMARY ===');
    console.log(`Total buttons: ${allButtons}`);
    console.log(`Responsive behavior:`, responsiveResults);
    console.log(`Visual separators: ${separators}`);
    console.log(`Contextual behavior: ${contextualChange}`);
    console.log('Analysis complete! Check screenshots in tests/screenshots/');

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

analyzeToolbar();