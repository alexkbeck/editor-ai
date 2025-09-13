import { test, expect, type Page } from '@playwright/test';

test.describe('Toolbar Analysis for TOOLBAR.md Requirements', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/editor');
    // Wait for the editor to load
    await page.waitForSelector('[data-plate-editor]');
    // Wait a bit more for toolbar to fully render
    await page.waitForTimeout(2000);
  });

  test('Capture toolbar screenshots and analyze implementation', async () => {
    // Take a full-page screenshot to see the overall layout
    await page.screenshot({
      path: '/home/alex/dev/editor-ai/tests/screenshots/full-editor-view.png',
      fullPage: true
    });

    // Take a focused screenshot of just the toolbar area
    const toolbar = page.locator('[data-testid="fixed-toolbar"], .toolbar, [role="toolbar"]').first();
    if (await toolbar.isVisible()) {
      await toolbar.screenshot({
        path: '/home/alex/dev/editor-ai/tests/screenshots/toolbar-desktop.png'
      });
    }

    // Test different viewport sizes for responsive analysis
    const viewportSizes = [
      { width: 375, height: 667, name: 'mobile' }, // iPhone SE
      { width: 768, height: 1024, name: 'tablet' }, // iPad
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'ultra-wide' }
    ];

    for (const viewport of viewportSizes) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Allow responsive changes to settle

      await page.screenshot({
        path: `/home/alex/dev/editor-ai/tests/screenshots/toolbar-${viewport.name}.png`
      });
    }

    // Reset to desktop for detailed analysis
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
  });

  test('Analyze toolbar structure and grouping', async () => {
    // Analyze toolbar groups and their structure
    const toolbarGroups = await page.locator('[role="toolbar"] > *').all();
    const groupData = [];

    for (let i = 0; i < toolbarGroups.length; i++) {
      const group = toolbarGroups[i];
      const buttons = await group.locator('button, [role="button"]').all();
      const groupInfo = {
        index: i,
        buttonCount: buttons.length,
        className: await group.getAttribute('class') || '',
        hasSeperator: (await group.getAttribute('class') || '').includes('separator') ||
                     (await group.getAttribute('data-separator')) === 'true'
      };
      groupData.push(groupInfo);
    }

    // Check for "More" button
    const moreButton = page.locator('button:has-text("More"), [aria-label*="More"], [data-testid*="more"]');
    const hasMoreButton = await moreButton.count() > 0;

    // Count total visible buttons
    const allButtons = await page.locator('[role="toolbar"] button:visible').count();

    // Log analysis results
    console.log('Toolbar Analysis Results:');
    console.log('========================');
    console.log(`Total toolbar groups: ${groupData.length}`);
    console.log(`Total visible buttons: ${allButtons}`);
    console.log(`Has "More" button: ${hasMoreButton}`);
    console.log('Group structure:', JSON.stringify(groupData, null, 2));

    // Store results for verification
    await page.evaluate((results) => {
      (window as any).toolbarAnalysis = results;
    }, { groupData, allButtons, hasMoreButton });
  });

  test('Check progressive disclosure implementation', async () => {
    // Check for progressive disclosure at different viewport sizes
    const results: any = {};

    const viewportSizes = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'ultra-wide' }
    ];

    for (const viewport of viewportSizes) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      const visibleButtons = await page.locator('[role="toolbar"] button:visible').count();
      const moreButton = page.locator('button:has-text("More"), [aria-label*="More"], [data-testid*="more"]');
      const hasMoreButton = await moreButton.count() > 0;

      results[viewport.name] = {
        visibleButtons,
        hasMoreButton,
        viewport: viewport
      };
    }

    console.log('Progressive Disclosure Analysis:');
    console.log('================================');
    Object.entries(results).forEach(([size, data]: [string, any]) => {
      console.log(`${size}: ${data.visibleButtons} buttons, More button: ${data.hasMoreButton}`);
    });

    // Store results
    await page.evaluate((results) => {
      (window as any).progressiveDisclosureAnalysis = results;
    }, results);
  });

  test('Analyze visual hierarchy and spacing', async () => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Get toolbar element properties
    const toolbar = page.locator('[role="toolbar"]').first();
    const toolbarBounds = await toolbar.boundingBox();

    // Analyze button sizes and spacing
    const buttons = await page.locator('[role="toolbar"] button:visible').all();
    const buttonAnalysis = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const bounds = await button.boundingBox();
      if (bounds) {
        buttonAnalysis.push({
          index: i,
          width: bounds.width,
          height: bounds.height,
          x: bounds.x,
          y: bounds.y
        });
      }
    }

    // Check for visual separators
    const separators = await page.locator('[role="toolbar"] [data-separator="true"], [role="toolbar"] .separator, [role="toolbar"] hr').count();

    console.log('Visual Hierarchy Analysis:');
    console.log('==========================');
    console.log(`Toolbar width: ${toolbarBounds?.width || 'unknown'}`);
    console.log(`Number of visual separators: ${separators}`);
    console.log(`Button count: ${buttonAnalysis.length}`);

    if (buttonAnalysis.length > 0) {
      const avgButtonWidth = buttonAnalysis.reduce((sum, b) => sum + b.width, 0) / buttonAnalysis.length;
      const avgButtonHeight = buttonAnalysis.reduce((sum, b) => sum + b.height, 0) / buttonAnalysis.length;
      console.log(`Average button size: ${avgButtonWidth.toFixed(1)}x${avgButtonHeight.toFixed(1)}px`);
    }

    // Store results
    await page.evaluate((analysis) => {
      (window as any).visualHierarchyAnalysis = analysis;
    }, { toolbarBounds, buttonAnalysis, separators });
  });

  test('Test contextual toolbar behavior', async () => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Get baseline toolbar state
    const baselineButtons = await page.locator('[role="toolbar"] button:visible').count();

    // Click in the editor to position cursor
    await page.click('[data-plate-editor]');
    await page.waitForTimeout(200);

    // Type some text
    await page.type('[data-plate-editor]', 'Test text for analysis');

    // Select the text
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(500);

    // Check if toolbar changes when text is selected
    const selectionButtons = await page.locator('[role="toolbar"] button:visible').count();

    // Try clicking on different content types if available
    const results = {
      baseline: baselineButtons,
      textSelected: selectionButtons,
      contextualChanges: selectionButtons !== baselineButtons
    };

    console.log('Contextual Toolbar Analysis:');
    console.log('============================');
    console.log(`Baseline buttons: ${results.baseline}`);
    console.log(`With text selected: ${results.textSelected}`);
    console.log(`Shows contextual changes: ${results.contextualChanges}`);

    // Store results
    await page.evaluate((analysis) => {
      (window as any).contextualToolbarAnalysis = analysis;
    }, results);
  });
});