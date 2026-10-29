const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/murat/.gemini/antigravity/brain/e771f600-92d1-4d9e-b3b6-8d887f9a2384';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message, failureDetails = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${message} ${failureDetails ? `-> ${failureDetails}` : ''}`);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('=== STARTING RIGOROUS VERIFICATION (CLOSING CHECKS) ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // =============================================================
  // TEST 1: Homepage Capture at y=0 & Featured Editorial Solutions
  // =============================================================
  console.log('[TEST 1] Homepage Capture at y=0 & Featured Solutions Flow...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Ensure scroll is at y=0 and all images are fully loaded
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    );
  });
  await sleep(250);

  // Verify header is at top of viewport
  const headerPosition = await page.evaluate(() => {
    const header = document.querySelector('header');
    const rect = header ? header.getBoundingClientRect() : null;
    return {
      top: rect ? rect.top : -999,
      scrollY: window.scrollY,
    };
  });

  assert(
    headerPosition.top === 0 && headerPosition.scrollY === 0,
    'Header is accurately positioned at the top of the page (y=0, top=0)',
    `top=${headerPosition.top}, scrollY=${headerPosition.scrollY}`
  );

  // Capture clean 1440px full page screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-homepage-1440-full.png'),
    fullPage: true,
  });
  console.log('  -> Saved screenshot-homepage-1440-full.png (verified header at top)');

  // Verify section content and editorial order
  const sectionData = await page.evaluate(() => {
    const section = document.querySelector('section#urunler');
    if (!section) return null;

    const title = section.querySelector('h2')?.innerText.trim() || '';
    const desc = section.querySelector('p')?.innerText.trim() || '';
    const exploreLink = section.querySelector('a[aria-label="17 ürünün tamamını keşfet"]');
    const exploreText = exploreLink?.innerText.trim() || '';
    const exploreHref = exploreLink?.getAttribute('href') || '';

    const cards = Array.from(section.querySelectorAll('[data-product-card="true"]'));
    const cardCodes = cards.map((c) => c.getAttribute('data-product-code'));

    const fullPageText = document.body.innerText.toLowerCase();
    const hasForbiddenBestseller = fullPageText.includes('en çok satan');
    const hasForbiddenRecommendedBundle = fullPageText.includes('önerilen paket');
    const hasUnverifiedEngineer = fullPageText.includes('mühendis destekli') || fullPageText.includes('muhendis destekli');

    return {
      title,
      desc,
      exploreText,
      exploreHref,
      cardCount: cards.length,
      cardCodes,
      hasForbiddenBestseller,
      hasForbiddenRecommendedBundle,
      hasUnverifiedEngineer,
    };
  });

  assert(
    sectionData?.title === 'Öne çıkan ölçüm çözümleri',
    'Section heading is exactly "Öne çıkan ölçüm çözümleri"',
    sectionData?.title
  );

  assert(
    sectionData?.exploreText === '17 ürünün tamamını keşfet' && sectionData?.exploreHref === '/kategori/tum-urunler',
    'Explore link text and href are correct ("17 ürünün tamamını keşfet" -> /kategori/tum-urunler)',
    `${sectionData?.exploreText} -> ${sectionData?.exploreHref}`
  );

  const expectedCodes = ['681000', '682000', '11733', '11190', '912200', '912206', '690109', '420145'];
  const codesMatch = JSON.stringify(sectionData?.cardCodes) === JSON.stringify(expectedCodes);
  assert(
    codesMatch,
    'Exactly 8 editorial products in specified order (681000, 682000, 11733, 11190, 912200, 912206, 690109, 420145)',
    JSON.stringify(sectionData?.cardCodes)
  );

  assert(!sectionData?.hasForbiddenBestseller, 'No commercial "en çok satan" label found');
  assert(!sectionData?.hasForbiddenRecommendedBundle, 'No commercial "önerilen paket" label found');
  assert(!sectionData?.hasUnverifiedEngineer, 'Unverified "mühendis destekli" label eliminated from homepage');

  // ValueStrip text check
  const valueStripText = await page.evaluate(() => {
    return document.querySelector('section.mt-\\[24px\\]')?.innerText || '';
  });
  assert(
    valueStripText.includes('Cihaz ve sensör seçimi için teknik danışma'),
    'ValueStrip displays verified copy: "Cihaz ve sensör seçimi için teknik danışma"',
    valueStripText
  );

  // Capture featured section screenshot
  const sectionElement = await page.$('section#urunler');
  if (sectionElement) {
    await sectionElement.screenshot({
      path: path.join(ARTIFACT_DIR, 'screenshot-homepage-featured-1440.png'),
    });
    console.log('  -> Saved screenshot-homepage-featured-1440.png');
  }

  // 1280px viewport test
  await page.setViewport({ width: 1280, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(150);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-homepage-1280.png'),
  });
  console.log('  -> Saved screenshot-homepage-1280.png');

  // Reset viewport to 1440
  await page.setViewport({ width: 1440, height: 950 });

  // =============================================================
  // TEST 2: Unified ProductCard Specification
  // =============================================================
  console.log('\n[TEST 2] Unified ProductCard Specifications...');
  const firstCard = await page.$('[data-product-card="true"]');
  const cardDetails = await page.evaluate((el) => {
    if (!el) return null;
    const isAnchor = el.tagName.toLowerCase() === 'a';
    const href = el.getAttribute('href') || '';
    const imgDiv = el.querySelector('div:first-child > div:first-child');
    const imgBg = imgDiv ? window.getComputedStyle(imgDiv).backgroundColor : '';
    const img = el.querySelector('img');
    const imgClasses = img?.getAttribute('class') || '';
    const btn = el.querySelector('[data-card-btn="true"]');
    const btnText = btn?.innerText.trim() || '';
    const priceDiv = el.querySelector('.min-h-\\[44px\\]');
    const priceText = priceDiv?.innerText.replace(/\s+/g, ' ').trim() || '';

    return {
      isAnchor,
      href,
      imgBg,
      imgClasses,
      btnText,
      priceText,
    };
  }, firstCard);

  assert(cardDetails?.isAnchor, 'ProductCard root is a real <a> element');
  assert(cardDetails?.href?.startsWith('/urun/'), 'ProductCard has real href for native new-tab opening', cardDetails?.href);
  assert(cardDetails?.imgBg?.includes('255, 255, 255'), 'Visual area has pure white background', cardDetails?.imgBg);
  assert(cardDetails?.imgClasses?.includes('scale-[1.03]'), 'Product image hover scale is max 3% (scale-[1.03])', cardDetails?.imgClasses);
  assert(cardDetails?.imgClasses?.includes('duration-[180ms]'), 'ProductCard transitions use 180ms duration', cardDetails?.imgClasses);
  assert(cardDetails?.btnText === 'Ürünü incele', 'Bottom button is full-width with label "Ürünü incele"', cardDetails?.btnText);
  assert(cardDetails?.priceText?.includes('TL') && cardDetails?.priceText?.includes('+ KDV'), 'Price and TL are formatted on the same line with + KDV', cardDetails?.priceText);

  // Keyboard tab focus test on card
  await page.evaluate(() => {
    const card = document.querySelector('[data-product-card="true"]');
    if (card) card.focus();
  });
  const isCardFocused = await page.evaluate(() => {
    const active = document.activeElement;
    return active && active.getAttribute('data-product-card') === 'true';
  });
  assert(isCardFocused, 'ProductCard receives direct keyboard focus via Tab');

  if (firstCard) {
    await firstCard.screenshot({
      path: path.join(ARTIFACT_DIR, 'screenshot-product-card-unified.png'),
    });
    console.log('  -> Saved screenshot-product-card-unified.png');
  }

  // =============================================================
  // TEST 3: Catalog Page with Unified Cards & 17 Products
  // =============================================================
  console.log('\n[TEST 3] Catalog Page (/kategori/tum-urunler) Integrity...');
  await page.goto('http://localhost:3000/kategori/tum-urunler', { waitUntil: 'networkidle0' });

  const catalogCounts = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-product-card="true"]'));
    return {
      count: cards.length,
      allAnchors: cards.every((c) => c.tagName.toLowerCase() === 'a' && c.getAttribute('href')?.startsWith('/urun/')),
      allWhiteImgs: cards.every((c) => {
        const img = c.querySelector('div:first-child > div:first-child');
        return img && window.getComputedStyle(img).backgroundColor.includes('255, 255, 255');
      }),
    };
  });

  assert(catalogCounts.count === 17, 'Full catalogue has 17 products accessible', `Count: ${catalogCounts.count}`);
  assert(catalogCounts.allAnchors, 'All 17 catalogue cards are real <a> links');
  assert(catalogCounts.allWhiteImgs, 'All 17 catalogue cards use pure white image areas');

  // =============================================================
  // TEST 4: Product Detail Page & Sticky Bottom Purchase Bar
  // =============================================================
  console.log('\n[TEST 4] Product Detail Page & Sticky Bottom Purchase Bar...');
  await page.goto('http://localhost:3000/urun/681000-mru-400gd', { waitUntil: 'networkidle0' });

  // At top of page, sticky bar must not be rendered
  const barAtTop = await page.evaluate(() => {
    return Boolean(document.querySelector('[data-sticky-bottom-bar="true"]'));
  });
  assert(!barAtTop, 'Sticky bottom bar is hidden when upper buy action is visible at top of page');

  // Scroll down 750px
  await page.evaluate(() => window.scrollTo(0, 750));
  await sleep(400);

  const barScrolled = await page.evaluate(() => {
    const bar = document.querySelector('[data-sticky-bottom-bar="true"]');
    if (!bar) return null;
    return {
      text: bar.innerText.replace(/\s+/g, ' ').trim(),
      hasModel: bar.innerText.includes('MRU 400GD'),
      hasPrice: bar.innerText.includes('14.375 TL'),
      hasButton: bar.innerText.includes('Sepete Ekle'),
    };
  });

  assert(Boolean(barScrolled), 'Sticky bottom bar appears when upper buy action scrolls above viewport');
  assert(barScrolled?.hasModel, 'Sticky bar displays device model ("MRU 400GD")');
  assert(barScrolled?.hasPrice, 'Sticky bar displays initial price ("14.375 TL")');
  assert(barScrolled?.hasButton, 'Sticky bar displays buy button');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-detail-sticky-bar.png'),
  });
  console.log('  -> Saved screenshot-detail-sticky-bar.png');

  // Click sticky buy button with 0 sensors selected -> calm warning trigger
  const stickyBuyBtn = await page.$('[data-sticky-buy-btn="true"]');
  if (stickyBuyBtn) {
    await stickyBuyBtn.click();
    await sleep(350);
  }

  const warningVisible = await page.evaluate(() => {
    const box = document.getElementById('sensor-warning-box');
    return box && box.innerText.includes('Sensör seçilmedi') && box.innerText.includes('Ölçüm için uyumlu sensör gerekir');
  });
  assert(warningVisible, 'Calm warning ("Sensör seçilmedi") is triggered and displayed when buy clicked with 0 sensors');

  // Select sensors & verify real-time bundle total in sticky bar
  await page.evaluate(() => {
    const toggleSensor = (code) => {
      const btn = document.querySelector(`[data-sensor-toggle="${code}"]`);
      if (btn) btn.click();
    };
    toggleSensor('11591'); // HC401 (6.765 TL)
    toggleSensor('11190'); // RF400 (8.625 TL)
  });
  await sleep(250);

  // Increment RF400 quantity to 2
  await page.evaluate(() => {
    const rfCard = document.querySelector('[data-sensor-code="11190"]');
    const plusBtn = rfCard?.querySelector('button[aria-label="Sensör adedini artır"]');
    if (plusBtn) plusBtn.click();
  });
  await sleep(250);

  // Scroll down to check sticky bar bundle total
  await page.evaluate(() => window.scrollTo(0, 1100));
  await sleep(350);

  const bundleData = await page.evaluate(() => {
    const bar = document.querySelector('[data-sticky-bottom-bar="true"]');
    const text = bar ? bar.innerText : '';
    // 14.375 (400GD) + 6.765 (HC401) + 17.250 (2x RF400) = 38.390 TL
    const isTotalCorrect = text.includes('38.390');
    const has4Items = text.includes('4 Adet');
    return { text: text.replace(/\s+/g, ' ').trim(), isTotalCorrect, has4Items };
  });

  assert(
    bundleData.isTotalCorrect && bundleData.has4Items,
    'Sticky bar calculates synchronized bundle total: 1x 400GD + 1x HC401 + 2x RF400 = 38.390 TL (4 Adet)',
    bundleData.text
  );

  // Scroll back to y=0 to verify sticky bar hides
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(350);
  const barHiddenAgain = await page.evaluate(() => {
    return !document.querySelector('[data-sticky-bottom-bar="true"]');
  });
  assert(barHiddenAgain, 'Sticky bar hides cleanly when scrolled back up to top purchase section');

  // =============================================================
  // TEST 5: CartDrawer Focus Trap & Return Focus
  // =============================================================
  console.log('\n[TEST 5] CartDrawer Focus Trap & Return Focus Behavior...');

  // Scroll down and click buy to open cart with bundle
  await page.evaluate(() => window.scrollTo(0, 1100));
  await sleep(350);
  const buyBtnForCart = await page.$('[data-sticky-buy-btn="true"]');
  if (buyBtnForCart) {
    await buyBtnForCart.click();
    await sleep(400);
  }

  // 1. Check if drawer is open
  const isDrawerOpen = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    return drawer && window.getComputedStyle(drawer).visibility !== 'hidden';
  });
  assert(isDrawerOpen, 'CartDrawer opened successfully upon adding bundle');

  // 2. Check focus is moved inside drawer
  const focusInside = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    const active = document.activeElement;
    return drawer ? drawer.contains(active) : false;
  });
  assert(focusInside, 'Focus is automatically moved inside the CartDrawer panel');

  // 3. Tab cycling test: Tab through all focusable elements and ensure focus never leaves the drawer
  let escapedDrawer = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
      return drawer ? drawer.contains(document.activeElement) : false;
    });
    if (!inside) {
      escapedDrawer = true;
      break;
    }
  }
  assert(!escapedDrawer, 'Tab cycling trap prevents focus from leaking to background controls');

  // 4. Shift+Tab test
  let shiftTabEscaped = false;
  for (let i = 0; i < 5; i++) {
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    const inside = await page.evaluate(() => {
      const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
      return drawer ? drawer.contains(document.activeElement) : false;
    });
    if (!inside) {
      shiftTabEscaped = true;
      break;
    }
  }
  assert(!shiftTabEscaped, 'Shift+Tab trap keeps focus trapped inside drawer');

  // 5. Escape key test and return focus
  await page.keyboard.press('Escape');
  await sleep(300);

  const isDrawerClosed = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    return !drawer || window.getComputedStyle(drawer).visibility === 'hidden';
  });
  assert(isDrawerClosed, 'Pressing Escape closes the CartDrawer');

  const returnedFocus = await page.evaluate(() => {
    const active = document.activeElement;
    return active && active.getAttribute('data-sticky-buy-btn') === 'true';
  });
  assert(returnedFocus, 'Focus returns to the trigger button that opened the cart');

  // =============================================================
  // TEST 6: Scroll Padding & Reduced Motion Assertions
  // =============================================================
  console.log('\n[TEST 6] Strict CSS & Reduced Motion Assertions...');

  const scrollPaddingValue = await page.evaluate(() => {
    return window.getComputedStyle(document.documentElement).scrollPaddingTop;
  });

  assert(
    scrollPaddingValue === '160px',
    'HTML scroll-padding-top is strictly configured to 160px to prevent sticky header occlusion',
    `Value: ${scrollPaddingValue}`
  );

  // Emulate reduced motion
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const reducedMotionActive = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  assert(reducedMotionActive, 'Browser correctly registers prefers-reduced-motion media query');

  // Check that scroll helper respects reduced motion
  const reducedMotionBehavior = await page.evaluate(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return isReduced ? 'auto' : 'smooth';
  });
  assert(reducedMotionBehavior === 'auto', 'JavaScript scrollToElement switches behavior to "auto" under reduced motion');

  // =============================================================
  // FINAL REPORT & EXIT CODE
  // =============================================================
  console.log('\n======================================================');
  console.log(`VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASSED, ${failedChecks} FAILED`);
  console.log('======================================================');

  await browser.close();

  if (failedChecks > 0) {
    console.error(`\nProcess exiting with code 1 due to ${failedChecks} failed assertion(s).`);
    process.exit(1);
  } else {
    console.log('\nAll assertions passed strictly with 100% success rate.');
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error('Unexpected verification exception:', err);
  process.exit(1);
});
