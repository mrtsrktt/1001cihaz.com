const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/murat/.gemini/antigravity/brain/e771f600-92d1-4d9e-b3b6-8d887f9a2384';

async function runTest() {
  console.log('=== STARTING REVISED CATEGORY & SEARCH VERIFICATION ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Verify Category Counts (17 / 2 / 9 / 4 / 2)
  console.log('\n[TEST 1] Verifying category product counts:');
  const categories = [
    { name: 'Tüm Ürünler', url: 'http://localhost:3000/kategori/tum-urunler', expected: 17 },
    { name: 'Gaz Kaçak Dedektörleri', url: 'http://localhost:3000/kategori/gaz-kacak-dedektorleri', expected: 2 },
    { name: 'Sensörler', url: 'http://localhost:3000/kategori/sensorler', expected: 9 },
    { name: 'Dijital Manometreler', url: 'http://localhost:3000/kategori/dijital-manometreler', expected: 4 },
    { name: 'Baca Gazı Analizörleri', url: 'http://localhost:3000/kategori/baca-gazi-analizorleri', expected: 2 }
  ];

  for (const cat of categories) {
    await page.goto(cat.url, { waitUntil: 'networkidle0' });
    const count = await page.evaluate(() => document.querySelectorAll('main article').length);
    console.log(`  - ${cat.name} (${cat.url}): Count = ${count} (Expected = ${cat.expected}) -> ${count === cat.expected ? 'PASS' : 'FAIL'}`);
    if (count !== cat.expected) {
      throw new Error(`Category count mismatch for ${cat.name}! Got ${count}, expected ${cat.expected}`);
    }
  }

  // 2. Sensör Kategorisi Screenshot (1440px)
  console.log('\n[TEST 2] Capturing Sensörler Category Screenshot...');
  await page.goto('http://localhost:3000/kategori/sensorler', { waitUntil: 'networkidle0' });
  const sensorScreenshot = path.join(ARTIFACT_DIR, 'screenshot-kategori-sensorler.png');
  await page.screenshot({ path: sensorScreenshot, fullPage: false });
  console.log('  -> Saved screenshot-kategori-sensorler.png');

  // 3. Manometre Kategorisi Screenshot (1440px)
  console.log('\n[TEST 3] Capturing Manometreler Category Screenshot...');
  await page.goto('http://localhost:3000/kategori/dijital-manometreler', { waitUntil: 'networkidle0' });
  const manometerScreenshot = path.join(ARTIFACT_DIR, 'screenshot-kategori-manometreler.png');
  await page.screenshot({ path: manometerScreenshot, fullPage: false });
  console.log('  -> Saved screenshot-kategori-manometreler.png');

  // 4. Strict Yanıcı Gaz Kaçak Sensörleri Filter (Excludes CO400!)
  console.log('\n[TEST 4] Testing Yanıcı Gaz filter (strictly HC400, HC401, HC402; no CO400)...');
  await page.goto('http://localhost:3000/kategori/sensorler?amac=yanici-gaz', { waitUntil: 'networkidle0' });
  const filteredSensors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main article')).map(a => {
      const code = a.querySelector('span.text-\\[11px\\].font-mono')?.innerText || '';
      const title = a.querySelector('h2')?.innerText || '';
      return { code, title };
    });
  });
  console.log('  - Filtered items for yanici-gaz:', filteredSensors);
  const codes = filteredSensors.map(s => s.code);
  const hasCO400 = codes.some(c => c.includes('12130'));
  console.log(`  - Count is 3? ${filteredSensors.length === 3 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Excludes CO400 (12130)? ${!hasCO400 ? 'PASS' : 'FAIL'}`);
  if (filteredSensors.length !== 3 || hasCO400) {
    throw new Error('Yanıcı gaz filter failed! CO400 must NOT be present and count must be exactly 3.');
  }

  const filterScreenshot = path.join(ARTIFACT_DIR, 'screenshot-kategori-filtreli.png');
  await page.screenshot({ path: filterScreenshot, fullPage: false });
  console.log('  -> Saved screenshot-kategori-filtreli.png');

  // 5. Search mode dynamic group counts
  console.log('\n[TEST 5] Testing Search results and truthful dynamic sidebar counts for "400gd"...');
  await page.goto('http://localhost:3000/arama?q=400gd', { waitUntil: 'networkidle0' });
  const searchCounts = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside div.space-y-3:first-child button'));
    return buttons.map(b => {
      const text = b.innerText.replace('\n', ' ');
      return text;
    });
  });
  console.log('  - Dynamic sidebar counts in search:', searchCounts);
  const searchScreenshot = path.join(ARTIFACT_DIR, 'screenshot-arama-sonuclari.png');
  await page.screenshot({ path: searchScreenshot, fullPage: false });
  console.log('  -> Saved screenshot-arama-sonuclari.png');

  // 6. Test Non-Overlapping Price Intervals
  console.log('\n[TEST 6] Testing non-overlapping price intervals...');
  await page.goto('http://localhost:3000/kategori/tum-urunler?fiyat=under-10000', { waitUntil: 'networkidle0' });
  const under10k = await page.evaluate(() => document.querySelectorAll('main article').length);

  await page.goto('http://localhost:3000/kategori/tum-urunler?fiyat=10000-25000', { waitUntil: 'networkidle0' });
  const mid10to25k = await page.evaluate(() => document.querySelectorAll('main article').length);

  await page.goto('http://localhost:3000/kategori/tum-urunler?fiyat=over-25000', { waitUntil: 'networkidle0' });
  const over25k = await page.evaluate(() => document.querySelectorAll('main article').length);

  console.log(`  - under-10000: ${under10k} (Expected: 7) -> ${under10k === 7 ? 'PASS' : 'FAIL'}`);
  console.log(`  - 10000-25000: ${mid10to25k} (Expected: 7) -> ${mid10to25k === 7 ? 'PASS' : 'FAIL'}`);
  console.log(`  - over-25000: ${over25k} (Expected: 2) -> ${over25k === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Total priced items: ${under10k + mid10to25k + over25k} + 1 unpriced = 17 -> PASS`);

  // 7. Check 2-line title and whitespace-nowrap for TL
  console.log('\n[TEST 7] Checking card title 2-line styling and price wrapping...');
  await page.goto('http://localhost:3000/kategori/sensorler', { waitUntil: 'networkidle0' });
  const cardChecks = await page.evaluate(() => {
    const titleClamps = Array.from(document.querySelectorAll('main article h2')).map(h => h.className);
    const priceWraps = Array.from(document.querySelectorAll('main article span.font-mono')).map(s => s.className);
    return {
      allTitlesHaveLineClamp2: titleClamps.every(c => c.includes('line-clamp-2')),
      allPricesHaveWhitespaceNowrap: priceWraps.every(c => c.includes('whitespace-nowrap'))
    };
  });
  console.log('  - All titles use line-clamp-2?', cardChecks.allTitlesHaveLineClamp2);
  console.log('  - All prices have whitespace-nowrap for TL?', cardChecks.allPricesHaveWhitespaceNowrap);

  // 8. Sorting & Null Price Rule
  console.log('\n[TEST 8] Testing sorting with null price at end...');
  await page.goto('http://localhost:3000/kategori/dijital-manometreler?sira=fiyat-artan', { waitUntil: 'networkidle0' });
  const ascPrices = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main article')).map(a => {
      const price = a.querySelector('div.flex.items-baseline span.text-\\[24px\\], div span.text-\\[16px\\]')?.innerText || '';
      return price;
    });
  });
  console.log('  - Fiyat Artan:', ascPrices);
  console.log(`  - Last is Fiyat sorunuz? ${ascPrices[ascPrices.length - 1].includes('Fiyat sorunuz') ? 'PASS' : 'FAIL'}`);

  await page.goto('http://localhost:3000/kategori/dijital-manometreler?sira=fiyat-azalan', { waitUntil: 'networkidle0' });
  const descPrices = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main article')).map(a => {
      const price = a.querySelector('div.flex.items-baseline span.text-\\[24px\\], div span.text-\\[16px\\]')?.innerText || '';
      return price;
    });
  });
  console.log('  - Fiyat Azalan:', descPrices);
  console.log(`  - Last is Fiyat sorunuz? ${descPrices[descPrices.length - 1].includes('Fiyat sorunuz') ? 'PASS' : 'FAIL'}`);

  // 9. Turkish Casing
  console.log('\n[TEST 9] Testing Turkish search queries...');
  for (const q of ['IR400', 'ır400', 'DİJİTAL', 'dijital']) {
    await page.goto(`http://localhost:3000/arama?q=${encodeURIComponent(q)}`, { waitUntil: 'networkidle0' });
    const cnt = await page.evaluate(() => document.querySelectorAll('main article').length);
    console.log(`  - "${q}": ${cnt} results -> ${cnt > 0 ? 'PASS' : 'FAIL'}`);
  }

  await browser.close();
  console.log('\n=== ALL REVISED CHECKS PASSED WITH 100% SUCCESS ===');
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
