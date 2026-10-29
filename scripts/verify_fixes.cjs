const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/murat/.gemini/antigravity/brain/e771f600-92d1-4d9e-b3b6-8d887f9a2384';

async function runVerification() {
  console.log('--- STARTING VERIFICATION ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  // 1. Check HC400 Product Page & Cleaned Description
  console.log('\n[TEST 1] Checking HC400 page for LaTeX sanitization...');
  await page.goto('http://localhost:3000/urun/11138-hc400-patlayici-kacak-sensoru-ch4-kalibreli', { waitUntil: 'networkidle0' });

  const hc400Data = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText || '';
    const desc = document.querySelector('p.text-\\[16px\\]')?.innerText || '';
    const overview = document.querySelector('#genel-bakis')?.innerText || '';
    const specs = document.querySelector('#teknik-ozellikler')?.innerText || '';
    return {
      title,
      desc,
      hasDollarInDesc: desc.includes('$'),
      hasDollarInSpecs: specs.includes('$'),
      containsUnicodeFormula: desc.includes('(CH₄)') || desc.includes('CH₄')
    };
  });

  console.log('HC400 Title:', hc400Data.title);
  console.log('HC400 Description:', hc400Data.desc);
  console.log('Has dollar in desc?', hc400Data.hasDollarInDesc);
  console.log('Has dollar in specs?', hc400Data.hasDollarInSpecs);
  console.log('Contains clean Unicode formula?', hc400Data.containsUnicodeFormula);

  // Take screenshot of HC400 detail
  const hc400ScreenshotPath = path.join(ARTIFACT_DIR, 'screenshot-hc400-cleaned.png');
  await page.screenshot({ path: hc400ScreenshotPath, fullPage: false });
  console.log('Saved screenshot-hc400-cleaned.png');

  // 2. Check DM9600 Manometer Range Selector & Prices
  console.log('\n[TEST 2] Checking DM9600 Manometer range selector prices...');
  await page.goto('http://localhost:3000/urun/912200-dm9600-hassas-dijital-manometre-75-mbar', { waitUntil: 'networkidle0' });

  const manometerOptions = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('div.grid.grid-cols-2.sm\\:grid-cols-4 button'));
    return buttons.map(b => {
      const strong = b.querySelector('strong')?.innerText || '';
      const span = b.querySelector('span')?.innerText || '';
      return { range: strong, price: span };
    });
  });

  console.log('Manometer selector options found on page:');
  manometerOptions.forEach(opt => console.log(`  - ${opt.range}: ${opt.price}`));

  // Take screenshot of DM9600 range selector
  const manometerScreenshotPath = path.join(ARTIFACT_DIR, 'screenshot-manometer-prices-verified.png');
  await page.screenshot({ path: manometerScreenshotPath, fullPage: false });
  console.log('Saved screenshot-manometer-prices-verified.png');

  // 3. Check Quantity Wording & Bundle Math
  console.log('\n[TEST 3] Checking quantity wording (5 adet · 3 farklı ürün) & bundle...');
  await page.goto('http://localhost:3000/urun/681000-400gd-temel-cihaz-gaz-kacak-tespiti-ve-analizi', { waitUntil: 'networkidle0' });

  // Clear existing cart
  await page.evaluate(() => localStorage.removeItem('1001cihaz_cart'));
  await page.reload({ waitUntil: 'networkidle0' });

  // Increase device quantity to 2 using real click
  await page.waitForSelector('button[aria-label="Cihaz adedini artır"]');
  await page.click('button[aria-label="Cihaz adedini artır"]');
  await new Promise(r => setTimeout(r, 200));

  // Select HC401 (11591)
  await page.waitForSelector('[data-sensor-toggle="11591"]');
  await page.click('[data-sensor-toggle="11591"]');
  await new Promise(r => setTimeout(r, 200));

  // Select RF400 (11190)
  await page.waitForSelector('[data-sensor-toggle="11190"]');
  await page.click('[data-sensor-toggle="11190"]');
  await new Promise(r => setTimeout(r, 200));

  // Increase RF400 qty to 2 by clicking the + button inside the RF400 card
  await page.evaluate(() => {
    const card = document.querySelector('div[data-sensor-code="11190"]');
    if (card) {
      const plus = card.querySelector('button[aria-label="Sensör adedini artır"]');
      if (plus) plus.click();
    }
  });
  await new Promise(r => setTimeout(r, 300));

  // Check buy button text in buy box and configurator
  const buttonTexts = await page.evaluate(() => {
    const buyBoxBtn = document.querySelector('button.bg-\\[\\#C82B35\\].text-white.text-\\[16px\\] span')?.innerText || '';
    const configBtn = document.querySelector('div.mt-6 button.bg-\\[\\#C82B35\\] span')?.innerText || '';
    const sensorsSummaryText = document.querySelector('div.space-y-2 div:nth-child(2) span')?.innerText || '';
    const totalText = document.querySelector('div.space-y-2 span.text-\\[24px\\]')?.innerText || '';
    return { buyBoxBtn, configBtn, sensorsSummaryText, totalText };
  });

  console.log('Buy box button text:', buttonTexts.buyBoxBtn);
  console.log('Configurator button text:', buttonTexts.configBtn);
  console.log('Sensors summary line:', buttonTexts.sensorsSummaryText);
  console.log('Configurator bundle total:', buttonTexts.totalText);

  // Click add bundle button
  await page.click('div.mt-6 button.bg-\\[\\#C82B35\\]');
  await new Promise(r => setTimeout(r, 500));

  // Wait for cart drawer to open
  await page.waitForSelector('#cart-drawer-title', { timeout: 5000 });

  const cartState = await page.evaluate(() => {
    const title = document.querySelector('#cart-drawer-title')?.innerText || '';
    const total = document.querySelector('div.flex.justify-between.items-baseline span.text-\\[18px\\]')?.innerText || '';
    const items = Array.from(document.querySelectorAll('div.p-3.bg-white.border.border-\\[\\#E2E7E8\\]')).map(item => {
      const name = item.querySelector('h4')?.innerText || '';
      const qty = item.querySelector('span.w-6')?.innerText || '';
      const price = item.querySelector('div.text-right span')?.innerText || '';
      return { name, qty, price };
    });
    return { title, total, items };
  });

  console.log('\nCart State in UI:');
  console.log('Cart Title:', cartState.title);
  console.log('Cart Total:', cartState.total);
  cartState.items.forEach(it => console.log(`  - ${it.qty} × ${it.name} = ${it.price}`));

  // Take screenshot of cart with 5 adet · 3 farklı ürün
  const cartScreenshotPath = path.join(ARTIFACT_DIR, 'screenshot-cart-5adet-3urun.png');
  await page.screenshot({ path: cartScreenshotPath, fullPage: false });
  console.log('Saved screenshot-cart-5adet-3urun.png');

  // 4. Cart LocalStorage Validation Test
  console.log('\n[TEST 4] Testing localStorage validation on page load...');
  await page.evaluate(() => {
    // Inject corrupt data
    const corruptCart = [
      { code: '912212', quantity: 2 }, // Product with null price -> MUST BE REJECTED
      { code: '681000', quantity: "2" }, // String numeric -> MUST BE REJECTED
      { code: '681000', quantity: 2.5 }, // Float quantity -> MUST BE REJECTED
      { code: '681000', quantity: -1 }, // Negative quantity -> MUST BE REJECTED
      { code: '681000', quantity: 0 }, // Zero quantity -> MUST BE REJECTED
      { code: 'nonexistent', quantity: 1 }, // Non-existent code -> MUST BE REJECTED
      { code: '912200', quantity: 1 } // Strictly valid -> MUST BE ACCEPTED
    ];
    localStorage.setItem('1001cihaz_cart', JSON.stringify(corruptCart));
  });

  // Reload page and check what loaded into cart
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Open cart drawer
  await page.waitForSelector('button[aria-label="Sepeti Görüntüle"]');
  await page.click('button[aria-label="Sepeti Görüntüle"]');
  await page.waitForSelector('#cart-drawer-title', { timeout: 5000 });

  const validatedCartState = await page.evaluate(() => {
    const title = document.querySelector('#cart-drawer-title')?.innerText || '';
    const items = Array.from(document.querySelectorAll('div.p-3.bg-white.border.border-\\[\\#E2E7E8\\]')).map(item => {
      const name = item.querySelector('h4')?.innerText || '';
      const qty = item.querySelector('span.w-6')?.innerText || '';
      return { name, qty };
    });
    return { title, items };
  });

  console.log('Validated cart after corrupt localStorage test:');
  console.log('Title:', validatedCartState.title);
  console.log('Items accepted:', validatedCartState.items);

  await browser.close();
  console.log('\n--- VERIFICATION FINISHED SUCCESSFULLY ---');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
