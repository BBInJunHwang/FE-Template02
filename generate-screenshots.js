const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const templates = [
    { name: 'about-us', folder: 'about-us' },
    { name: 'product', folder: 'product' },
    { name: 'event', folder: 'event' },
    { name: 'portfolio', folder: 'portfolio' },
    { name: 'landing', folder: 'landing' },
    { name: 'landing-saas', folder: 'landing-saas' },
    { name: 'landing-agency', folder: 'landing-agency' },
    { name: 'landing-app', folder: 'landing-app' },
    { name: 'landing-ai', folder: 'landing-ai' },
    { name: 'landing-startup', folder: 'landing-startup' }
];

async function generateScreenshots() {
    console.log('🚀 Starting screenshot generation...\n');

    const browser = await puppeteer.launch({
        headless: 'new'
    });

    for (const template of templates) {
        console.log(`📸 Capturing ${template.name}...`);

        const page = await browser.newPage();

        // Set viewport size
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
        });

        // Load template
        const htmlPath = path.join(__dirname, 'templates', template.folder, 'index.html');
        const htmlFile = 'file://' + htmlPath;

        try {
            await page.goto(htmlFile, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });

            // Wait for animations
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Take screenshot
            const screenshotPath = path.join(__dirname, 'screenshots', `${template.name}.png`);
            await page.screenshot({
                path: screenshotPath,
                fullPage: false // Only capture viewport
            });

            console.log(`✅ ${template.name}.png created`);
        } catch (error) {
            console.error(`❌ Error capturing ${template.name}:`, error.message);
        }

        await page.close();
    }

    await browser.close();
    console.log('\n🎉 All screenshots generated successfully!');
}

generateScreenshots().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
