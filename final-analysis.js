const playwright = require('@playwright/test');

async function getDetailedAnalysis() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Loading editor for detailed analysis...');
    await page.goto('http://localhost:3000/editor', { waitUntil: 'networkidle', timeout: 60000 });
    await page.setViewportSize({ width: 1280, height: 720 });

    // Get detailed button information
    const buttonDetails = await page.evaluate(() => {
      const toolbar = document.querySelector('[role="toolbar"]');
      if (!toolbar) return [];

      const buttons = Array.from(toolbar.querySelectorAll('button'));
      return buttons.map((btn, index) => {
        const rect = btn.getBoundingClientRect();
        const style = window.getComputedStyle(btn);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;

        return {
          index,
          text: btn.textContent?.trim() || '',
          ariaLabel: btn.getAttribute('aria-label') || '',
          title: btn.getAttribute('title') || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          x: Math.round(rect.x),
          hasIcon: btn.querySelector('svg') ? true : false,
          isVisible,
          className: btn.className
        };
      }).filter(btn => btn.isVisible);
    });

    console.log('\\n=== VISIBLE BUTTONS ANALYSIS ===');
    console.log(`Total visible buttons: ${buttonDetails.length}`);

    // Group analysis by position - buttons close together are likely in same group
    let groups = [];
    let currentGroup = [];
    let lastX = -1;

    for (const btn of buttonDetails) {
      if (lastX === -1 || (btn.x - lastX) < 50) {
        // Buttons close together - same group
        currentGroup.push(btn);
      } else {
        // Gap detected - new group
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [btn];
      }
      lastX = btn.x + btn.width;
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    console.log(`\\nDetected ${groups.length} logical button groups:`);
    groups.forEach((group, index) => {
      console.log(`\\nGroup ${index + 1} (${group.length} buttons):`);
      group.forEach(btn => {
        const label = btn.ariaLabel || btn.title || btn.text || `Button ${btn.index}`;
        console.log(`  - ${label} (${btn.width}x${btn.height}px)`);
      });
    });

    // Check spacing between groups
    console.log('\\n=== SPACING ANALYSIS ===');
    for (let i = 0; i < groups.length - 1; i++) {
      const currentGroupLastBtn = groups[i][groups[i].length - 1];
      const nextGroupFirstBtn = groups[i + 1][0];
      const gap = nextGroupFirstBtn.x - (currentGroupLastBtn.x + currentGroupLastBtn.width);
      console.log(`Gap between Group ${i + 1} and Group ${i + 2}: ${Math.round(gap)}px`);
    }

    // Analyze button sizes for consistency
    const buttonSizes = buttonDetails.map(btn => ({ width: btn.width, height: btn.height }));
    const avgWidth = buttonSizes.reduce((sum, size) => sum + size.width, 0) / buttonSizes.length;
    const avgHeight = buttonSizes.reduce((sum, size) => sum + size.height, 0) / buttonSizes.length;

    console.log(`\\nAverage button size: ${Math.round(avgWidth)}x${Math.round(avgHeight)}px`);

    // Get toolbar container analysis
    const toolbarAnalysis = await page.evaluate(() => {
      const toolbar = document.querySelector('[role="toolbar"]');
      if (!toolbar) return null;

      const rect = toolbar.getBoundingClientRect();
      const style = window.getComputedStyle(toolbar);

      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        padding: style.padding,
        backgroundColor: style.backgroundColor,
        borderBottom: style.borderBottom,
        position: style.position,
        zIndex: style.zIndex
      };
    });

    console.log('\\n=== TOOLBAR CONTAINER ANALYSIS ===');
    console.log(JSON.stringify(toolbarAnalysis, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

getDetailedAnalysis();