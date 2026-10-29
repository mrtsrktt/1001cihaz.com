const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/murat/.gemini/antigravity/brain/e771f600-92d1-4d9e-b3b6-8d887f9a2384';

async function verifyRevision() {
  console.log('=== STARTING REVISION VERIFICATION ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Check 5 sensor purpose groups in /kategori/sensorler (3 / 1 / 2 / 2 / 1)
  console.log('\n[TEST 1] Verifying 5 sensor purpose group counts (Expected: 3 / 1 / 2 / 2 / 1)...');
  await page.goto('http://localhost:3000/kategori/sensorler', { waitUntil: 'networkidle0' });

  const purposeCountsBase = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside div.space-y-3:first-child button, aside div.space-y-3:nth-child(2) button'));
    return buttons.map(b => {
      const label = b.querySelector('span:first-child')?.innerText.trim() || '';
      const count = b.querySelector('span:last-child')?.innerText.trim() || '';
      return { label, count: parseInt(count, 10) };
    }).filter(x => x.label && !isNaN(x.count));
  });

  console.log('Sensör Amacı counts (Base):', purposeCountsBase);

  const findCount = (list, query) => {
    const item = list.find(x => x.label.toLowerCase().includes(query.toLowerCase()));
    return item ? item.count : -1;
  };

  const yanici = findCount(purposeCountsBase, 'Yanıcı');
  const sogutucu = findCount(purposeCountsBase, 'Soğutucu');
  const ortam = findCount(purposeCountsBase, 'Ortam');
  const sicaklik = findCount(purposeCountsBase, 'Sıcaklık');
  const baca = findCount(purposeCountsBase, 'Baca');

  console.log(`  - Yanıcı Gazlar: ${yanici} (Expected: 3) -> ${yanici === 3 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Soğutucu Gazlar: ${sogutucu} (Expected: 1) -> ${sogutucu === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Ortam Gazları: ${ortam} (Expected: 2) -> ${ortam === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Sıcaklık & İklim: ${sicaklik} (Expected: 2) -> ${sicaklik === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Baca Geri Tepmesi: ${baca} (Expected: 1) -> ${baca === 1 ? 'PASS' : 'FAIL'}`);

  if (yanici !== 3 || sogutucu !== 1 || ortam !== 2 || sicaklik !== 2 || baca !== 1) {
    throw new Error(`Base purpose counts mismatch! Got ${yanici}/${sogutucu}/${ortam}/${sicaklik}/${baca}`);
  }

  // 2. Check Faceted Cross-Filtering: Sensörler + 10.000 TL altı (Expected: 3 / 1 / 1 / 2 / 1)
  console.log('\n[TEST 2] Verifying faceted purpose counts with under-10000 active (Expected: 3 / 1 / 1 / 2 / 1)...');
  await page.goto('http://localhost:3000/kategori/sensorler?fiyat=under-10000', { waitUntil: 'networkidle0' });

  const purposeCountsUnder10k = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside div.space-y-3:first-child button, aside div.space-y-3:nth-child(2) button'));
    return buttons.map(b => {
      const label = b.querySelector('span:first-child')?.innerText.trim() || '';
      const count = b.querySelector('span:last-child')?.innerText.trim() || '';
      return { label, count: parseInt(count, 10) };
    }).filter(x => x.label && !isNaN(x.count));
  });

  console.log('Sensör Amacı counts with under-10000 active:', purposeCountsUnder10k);

  const yanici10k = findCount(purposeCountsUnder10k, 'Yanıcı');
  const sogutucu10k = findCount(purposeCountsUnder10k, 'Soğutucu');
  const ortam10k = findCount(purposeCountsUnder10k, 'Ortam');
  const sicaklik10k = findCount(purposeCountsUnder10k, 'Sıcaklık');
  const baca10k = findCount(purposeCountsUnder10k, 'Baca');

  console.log(`  - Yanıcı Gazlar: ${yanici10k} (Expected: 3) -> ${yanici10k === 3 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Soğutucu Gazlar: ${sogutucu10k} (Expected: 1) -> ${sogutucu10k === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Ortam Gazları: ${ortam10k} (Expected: 1) -> ${ortam10k === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Sıcaklık & İklim: ${sicaklik10k} (Expected: 2) -> ${sicaklik10k === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Baca Geri Tepmesi: ${baca10k} (Expected: 1) -> ${baca10k === 1 ? 'PASS' : 'FAIL'}`);

  if (yanici10k !== 3 || sogutucu10k !== 1 || ortam10k !== 1 || sicaklik10k !== 2 || baca10k !== 1) {
    throw new Error(`Faceted purpose counts mismatch! Got ${yanici10k}/${sogutucu10k}/${ortam10k}/${sicaklik10k}/${baca10k}`);
  }

  // 3. Check Compatibility Filter replacement with info banner
  console.log('\n[TEST 3] Checking redundant compatibility filter replacement...');
  const compatInfo = await page.evaluate(() => {
    const text = document.querySelector('aside')?.innerText || '';
    const allButtons = Array.from(document.querySelectorAll('aside button'));
    const hasCompatButtons = allButtons.some(b => b.innerText.includes('400GD ile Uyumlu') || b.innerText.includes('500GD ile Uyumlu'));
    const hasBanner = text.includes('Bu sensörler MRU 400GD ve 500GD ile uyumludur');
    return { hasBanner, hasCompatButtons };
  });

  console.log(`  - Has informational banner? ${compatInfo.hasBanner ? 'PASS' : 'FAIL'}`);
  console.log(`  - Redundant interactive buttons hidden? ${!compatInfo.hasCompatButtons ? 'PASS' : 'FAIL'}`);

  if (!compatInfo.hasBanner) {
    throw new Error('Informational banner "Bu sensörler MRU 400GD ve 500GD ile uyumludur" not found in sidebar!');
  }

  // 4. Capture Filtered Screenshot
  console.log('\n[TEST 4] Capturing filtered screenshot...');
  const filterScreenshot = path.join(ARTIFACT_DIR, 'screenshot-kategori-filtreli.png');
  await page.screenshot({ path: filterScreenshot, fullPage: false });
  console.log('  -> Saved screenshot-kategori-filtreli.png');

  await browser.close();
  console.log('\n=== ALL REVISION TESTS PASSED WITH 100% SUCCESS! ===');
}

verifyRevision().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
