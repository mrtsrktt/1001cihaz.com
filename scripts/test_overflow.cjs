const puppeteer = require('puppeteer');

async function testOverflow() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const urls = [
    'http://localhost:3000/kategori/tum-urunler',
    'http://localhost:3000/kategori/sensorler',
    'http://localhost:3000/kategori/dijital-manometreler',
    'http://localhost:3000/arama?q=400gd'
  ];

  for (const width of [1280, 1440]) {
    await page.setViewport({ width, height: 900 });
    for (const u of urls) {
      await page.goto(u, { waitUntil: 'networkidle0' });
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`Width ${width}px on ${u}: Overflow = ${hasOverflow} -> ${!hasOverflow ? 'PASS' : 'FAIL'}`);
      if (hasOverflow) throw new Error(`Horizontal overflow detected at ${width}px on ${u}`);
    }
  }

  await browser.close();
  console.log('Overflow check passed!');
}

testOverflow().catch(err => {
  console.error(err);
  process.exit(1);
});
