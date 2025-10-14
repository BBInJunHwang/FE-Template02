const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 캡처할 템플릿 목록
const templates = [
  { name: 'ecommerce', title: 'E-commerce Shop' },
  { name: 'restaurant', title: 'Restaurant' },
  { name: 'fitness', title: 'Fitness Center' },
  { name: 'realestate', title: 'Real Estate' },
  { name: 'fashion', title: 'Fashion Brand' }
];

// screenshots 폴더가 없으면 생성
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async () => {
  console.log('🚀 Starting screenshot capture...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const template of templates) {
    try {
      console.log(`📸 Capturing ${template.title}...`);

      const page = await browser.newPage();

      // 뷰포트 설정 (데스크톱 기준)
      await page.setViewport({
        width: 1600,
        height: 1200,
        deviceScaleFactor: 1
      });

      // 템플릿 페이지 로드
      const url = `file://${path.join(__dirname, 'templates', template.name, 'index.html')}`;
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // 페이지가 완전히 로드될 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 스크롤 가능한 높이 계산 (최대 5000px로 제한)
      const bodyHeight = await page.evaluate(() => {
        return Math.min(document.body.scrollHeight, 5000);
      });

      // 뷰포트 높이를 컨텐츠에 맞게 조정
      await page.setViewport({
        width: 1600,
        height: bodyHeight,
        deviceScaleFactor: 1
      });

      // 스크린샷 캡처
      const screenshotPath = path.join(screenshotsDir, `${template.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png'
      });

      console.log(`✅ ${template.name}.png saved\n`);

      await page.close();
    } catch (error) {
      console.error(`❌ Error capturing ${template.name}:`, error.message);
    }
  }

  await browser.close();

  console.log('🎉 All screenshots captured successfully!');
  console.log('\n📁 Check the screenshots/ folder for the images.');
  console.log('\n💡 Tip: You can optimize the images using tools like:');
  console.log('   - https://tinypng.com/');
  console.log('   - https://squoosh.app/');
  console.log('   - ImageMagick: mogrify -resize 1600x -quality 85 screenshots/*.png');
})();
