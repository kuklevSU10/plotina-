const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:3339';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Create screenshot dir
    const fs = require('fs');
    if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

    console.log('🔗 Loading page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for animations

    // 1. Dark theme - full page
    console.log('📸 Dark theme - full page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_dark_fullpage.png'), fullPage: true });

    // 2. Switch to light theme
    console.log('🌞 Switching to light theme...');
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.backgroundColor = '#ffffff';
    });
    await page.waitForTimeout(500); // Wait for CSS transition

    // 3. Light theme - full page
    console.log('📸 Light theme - full page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_light_fullpage.png'), fullPage: true });

    // 4. Light theme section screenshots
    const sections = [
        { name: 'nav', selector: 'nav', scroll: false },
        { name: 'hero', selector: 'main > section:first-child, main > div:first-child', scroll: false },
    ];

    // Scroll through page taking screenshots at each viewport
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 900;
    let sectionIdx = 3;

    for (let scrollY = 0; scrollY < pageHeight; scrollY += viewportHeight * 0.7) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(300);
        const filename = `${String(sectionIdx).padStart(2, '0')}_light_scroll_${scrollY}.png`;
        console.log(`📸 ${filename}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
        sectionIdx++;
    }

    console.log(`\n✅ Done! ${sectionIdx - 1} screenshots saved to ${SCREENSHOT_DIR}`);
    await browser.close();
})();
