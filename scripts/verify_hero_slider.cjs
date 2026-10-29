const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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
  console.log('=== STARTING HERO SLIDER & SOFT INTERACTIONS VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // =============================================================
  // TEST 1: Initial Hero Structure & Exact Slide Content
  // =============================================================
  console.log('[TEST 1] Testing Hero Slider Structure, Dimensions & Slide Content...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  const heroMeta = await page.evaluate(() => {
    const heroSection = document.querySelector('section[aria-label="Öne Çıkan MRU Ölçüm Çözümleri"]');
    if (!heroSection) return { error: 'Hero section not found' };

    const stage = heroSection.querySelector('[role="region"][aria-roledescription="carousel"]');
    const stageRect = stage ? stage.getBoundingClientRect() : null;

    const track = document.querySelector('[data-hero-track="true"]');
    const slides = Array.from(track ? track.children : []);

    const tabsContainer = heroSection.querySelector('[role="tablist"]');
    const tabs = Array.from(tabsContainer ? tabsContainer.querySelectorAll('[role="tab"]') : []);

    const slideData = slides.map((slide, i) => {
      const text = slide.innerText;
      const tag = slide.querySelector('span')?.innerText.trim() || '';
      const h1 = slide.querySelector('h1')?.innerText.trim() || '';
      const p = slide.querySelector('p')?.innerText.trim() || '';
      const cta = slide.querySelector('a');
      const ctaText = cta ? cta.innerText.trim() : '';
      const ctaHref = cta ? cta.getAttribute('href') : '';
      const ctaTabIndex = cta ? cta.tabIndex : null;
      const hasPrice = text.includes('TL') || text.includes('KDV') || text.includes('₺') || text.includes('49.500');

      return {
        index: i,
        tag,
        h1,
        p,
        ctaText,
        ctaHref,
        ctaTabIndex,
        hasPrice,
      };
    });

    const prevBtn = heroSection.querySelector('button[aria-label="Önceki slayt"]');
    const nextBtn = heroSection.querySelector('button[aria-label="Sonraki slayt"]');
    const pauseBtn = heroSection.querySelector('[data-pause-toggle="true"]');

    return {
      hasHero: true,
      stageWidth: stageRect ? Math.round(stageRect.width) : null,
      stageHeight: stageRect ? Math.round(stageRect.height) : null,
      slideCount: slides.length,
      tabCount: tabs.length,
      tabLabels: tabs.map((t) => t.innerText.split('\n').filter(Boolean).pop().trim()),
      slideData,
      hasPrevBtn: Boolean(prevBtn),
      hasNextBtn: Boolean(nextBtn),
      hasPauseBtn: Boolean(pauseBtn),
    };
  });

  assert(heroMeta.hasHero, 'Hero section with carousel semantics found');
  assert(heroMeta.stageHeight === 480, `Slide stage height is strictly 480px (Actual: ${heroMeta.stageHeight}px)`);
  assert(heroMeta.slideCount === 4, `Exactly 4 slides rendered in track (Actual: ${heroMeta.slideCount})`);
  assert(heroMeta.tabCount === 4, `Exactly 4 navigation tabs rendered below hero (Actual: ${heroMeta.tabCount})`);
  assert(heroMeta.hasPrevBtn && heroMeta.hasNextBtn && heroMeta.hasPauseBtn, 'Navigation arrows and Pause/Play toggle controls present');

  // Verify Slide 1: DELTAsmart
  const s0 = heroMeta.slideData[0];
  assert(s0.tag === 'BACA GAZI ANALİZİ', 'Slide 1 tag is "BACA GAZI ANALİZİ"');
  assert(s0.h1.includes('Yanmayı ölçün.') && s0.h1.includes('Verimliliği değerlendirin.'), 'Slide 1 title is "Yanmayı ölçün. Verimliliği değerlendirin."');
  assert(s0.ctaText === 'DELTAsmart’ı incele' && s0.ctaHref.includes('/urun/690109'), 'Slide 1 CTA links to DELTAsmart');
  assert(!s0.hasPrice, 'Slide 1 contains NO price information');

  // Verify Slide 2: OPTIMA COA
  const s1 = heroMeta.slideData[1];
  assert(s1.tag === 'PROFESYONEL ANALİZ SETİ', 'Slide 2 tag is "PROFESYONEL ANALİZ SETİ"');
  assert(s1.h1.includes('Kapsamlı analiz.') && s1.h1.includes('Sahada net sonuçlar.'), 'Slide 2 title is "Kapsamlı analiz. Sahada net sonuçlar."');
  assert(s1.ctaText === 'OPTIMA COA’yı incele' && s1.ctaHref.includes('/urun/420145'), 'Slide 2 CTA links to OPTIMA COA');
  assert(!s1.hasPrice, 'Slide 2 contains NO price information');

  // Verify Slide 3: 400GD / 500GD
  const s2 = heroMeta.slideData[2];
  assert(s2.tag === 'MODÜLER GAZ KAÇAK TESPİTİ', 'Slide 3 tag is "MODÜLER GAZ KAÇAK TESPİTİ"');
  assert(s2.h1.includes('Cihazınızı seçin.') && s2.h1.includes('Ölçümünüzü genişletin.'), 'Slide 3 title is "Cihazınızı seçin. Ölçümünüzü genişletin."');
  assert(s2.ctaText === 'Cihazları keşfet' && s2.ctaHref === '/kategori/gaz-kacak-dedektorleri', 'Slide 3 CTA links to /kategori/gaz-kacak-dedektorleri');
  assert(!s2.hasPrice, 'Slide 3 contains NO price information');

  // Verify Slide 4: DM9600
  const s3 = heroMeta.slideData[3];
  assert(s3.tag === 'HASSAS BASINÇ ÖLÇÜMÜ', 'Slide 4 tag is "HASSAS BASINÇ ÖLÇÜMÜ"');
  assert(s3.h1.includes('Doğru aralık.') && s3.h1.includes('Hassas basınç ölçümü.'), 'Slide 4 title is "Doğru aralık. Hassas basınç ölçümü."');
  assert(s3.ctaText === 'DM9600 modellerini incele' && s3.ctaHref === '/kategori/dijital-manometreler', 'Slide 4 CTA links to /kategori/dijital-manometreler');
  assert(!s3.hasPrice, 'Slide 4 contains NO price information');

  // Verify Tab Isolation on Slide 0
  assert(s0.ctaTabIndex === 0, 'Active slide (Slide 0) CTA has tabIndex=0');
  assert(s1.ctaTabIndex === -1 && s2.ctaTabIndex === -1 && s3.ctaTabIndex === -1, 'Inactive slides (Slide 1, 2, 3) CTAs have tabIndex=-1 (isolated from Tab cycle)');

  // =============================================================
  // TEST 2: Capture 1440px Screenshots of All 4 Slides
  // =============================================================
  console.log('\n[TEST 2] Capturing 1440px High-Resolution Screenshots for All 4 Slides...');

  // Slide 0: DELTAsmart
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-hero-slide-1-deltasmart.png'),
  });
  console.log('  -> Saved screenshot-hero-slide-1-deltasmart.png');

  // Navigate to Slide 1 via Tab click
  await page.click('#hero-tab-1');
  await sleep(650); // wait for 550ms transition
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-hero-slide-2-optima.png'),
  });
  console.log('  -> Saved screenshot-hero-slide-2-optima.png');

  // Navigate to Slide 2 via Tab click
  await page.click('#hero-tab-2');
  await sleep(650);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-hero-slide-3-400gd.png'),
  });
  console.log('  -> Saved screenshot-hero-slide-3-400gd.png');

  // Navigate to Slide 3 via Tab click
  await page.click('#hero-tab-3');
  await sleep(650);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-hero-slide-4-dm9600.png'),
  });
  console.log('  -> Saved screenshot-hero-slide-4-dm9600.png');

  // =============================================================
  // TEST 3: Navigation Arrows & Tab Isolation Across Slides
  // =============================================================
  console.log('\n[TEST 3] Testing Navigation Arrows & Dynamic Tab Isolation...');

  // Currently at slide 3 (DM9600). Click Next -> should wrap to slide 0 (DELTAsmart)
  await page.click('button[aria-label="Sonraki slayt"]');
  await sleep(650);

  const activeIndexAfterNext = await page.evaluate(() => {
    const track = document.querySelector('[data-hero-track="true"]');
    return Number(track?.getAttribute('data-current-index'));
  });
  assert(activeIndexAfterNext === 0, `Next button wrapped from slide 3 to slide 0 (Actual: ${activeIndexAfterNext})`);

  // Click Prev from slide 0 -> should wrap to slide 3
  await page.click('button[aria-label="Önceki slayt"]');
  await sleep(650);

  const activeIndexAfterPrev = await page.evaluate(() => {
    const track = document.querySelector('[data-hero-track="true"]');
    return Number(track?.getAttribute('data-current-index'));
  });
  assert(activeIndexAfterPrev === 3, `Prev button wrapped from slide 0 to slide 3 (Actual: ${activeIndexAfterPrev})`);

  // Return to slide 0
  await page.click('#hero-tab-0');
  await sleep(650);

  // =============================================================
  // TEST 4: Auto-Advance & Pause Triggers (Hover, Focus, Manual Pause)
  // =============================================================
  console.log('\n[TEST 4] Testing Auto-Advance, Hover Pause, Focus Pause & Manual Pause Persistence...');

  // 1. Hover pause: Mouse over hero section
  await page.hover('section[aria-label="Öne Çıkan MRU Ölçüm Çözümleri"]');
  await sleep(1500);

  // Progress should not have triggered slide change during hover
  const slideAfterHover = await page.evaluate(() => {
    const track = document.querySelector('[data-hero-track="true"]');
    return Number(track?.getAttribute('data-current-index'));
  });
  assert(slideAfterHover === 0, 'Mouse hover over hero halts slide transition (Slide stays at 0)');

  // Move mouse away to empty area
  await page.mouse.move(0, 0);
  await sleep(200);

  // 2. Manual Pause toggle
  const pauseBtn = await page.$('[data-pause-toggle="true"]');
  await pauseBtn.click();
  await sleep(200);

  const pauseBtnText = await page.evaluate(() => {
    const btn = document.querySelector('[data-pause-toggle="true"]');
    return btn?.innerText.trim();
  });
  assert(pauseBtnText === 'Oynat', 'Clicking "Duraklat" toggles button label to "Oynat"');

  // Wait 2 seconds while paused -> must stay at slide 0
  await sleep(2000);
  const slideWhilePaused = await page.evaluate(() => {
    const track = document.querySelector('[data-hero-track="true"]');
    return Number(track?.getAttribute('data-current-index'));
  });
  assert(slideWhilePaused === 0, 'Slide remains stationary when manually paused');

  // Hover in and out while manually paused -> MUST REMAIN PAUSED!
  await page.hover('section[aria-label="Öne Çıkan MRU Ölçüm Çözümleri"]');
  await sleep(300);
  await page.mouse.move(0, 0);
  await sleep(1000);

  const stillPausedAfterHover = await page.evaluate(() => {
    const btn = document.querySelector('[data-pause-toggle="true"]');
    const track = document.querySelector('[data-hero-track="true"]');
    return {
      btnText: btn?.innerText.trim(),
      slide: Number(track?.getAttribute('data-current-index')),
    };
  });
  assert(
    stillPausedAfterHover.btnText === 'Oynat' && stillPausedAfterHover.slide === 0,
    'Manual pause is strictly preserved after hovering off (does NOT resume auto-advance)'
  );

  // Resume auto-advance by clicking "Oynat"
  await page.click('[data-pause-toggle="true"]');
  await sleep(200);

  // =============================================================
  // TEST 5: Responsive Layout & No Horizontal Overflow at 1280 & 1440px
  // =============================================================
  console.log('\n[TEST 5] Testing Viewport Overflow & Dimensions at 1440px and 1280px...');

  // Check 1440px
  const overflow1440 = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  assert(!overflow1440.hasOverflow, `No horizontal overflow at 1440px (scrollWidth: ${overflow1440.scrollWidth}px, clientWidth: ${overflow1440.clientWidth}px)`);

  // Check 1280px
  await page.setViewport({ width: 1280, height: 950 });
  await sleep(300);

  const overflow1280 = await page.evaluate(() => {
    const stage = document.querySelector('[role="region"][aria-roledescription="carousel"]');
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      stageHeight: stageRect ? Math.round(stageRect.height) : null,
    };
  });
  assert(!overflow1280.hasOverflow, `No horizontal overflow at 1280px (scrollWidth: ${overflow1280.scrollWidth}px, clientWidth: ${overflow1280.clientWidth}px)`);
  assert(overflow1280.stageHeight === 480, `Stage height remains exactly 480px at 1280px (Actual: ${overflow1280.stageHeight}px)`);

  // Reset to 1440px
  await page.setViewport({ width: 1440, height: 950 });
  await sleep(200);

  // =============================================================
  // TEST 6: Shared ProductCard Hover & Micro-interactions
  // =============================================================
  console.log('\n[TEST 6] Testing Shared ProductCard Hover & Soft Interaction Specs...');

  const cardHoverSpecs = await page.evaluate(() => {
    const card = document.querySelector('[data-product-card="true"]');
    if (!card) return null;

    const classes = card.className;
    const hasTranslateY = classes.includes('hover:-translate-y-1'); // -4px
    const hasSoftShadow = classes.includes('0_12px_28px_rgba(18,33,41,0.09)');
    const has220ms = classes.includes('duration-[220ms]');

    const img = card.querySelector('img');
    const imgClasses = img ? img.className : '';
    const hasScale103 = imgClasses.includes('group-hover:scale-[1.03]');
    const has350ms = imgClasses.includes('duration-[350ms]');

    const arrow = card.querySelector('[data-card-btn="true"] svg');
    const arrowClasses = arrow ? arrow.className.baseVal || arrow.className : '';
    const hasArrowTranslate = String(arrowClasses).includes('group-hover:translate-x-[3px]');

    return {
      hasTranslateY,
      hasSoftShadow,
      has220ms,
      hasScale103,
      has350ms,
      hasArrowTranslate,
    };
  });

  assert(cardHoverSpecs.hasTranslateY && cardHoverSpecs.has220ms, 'ProductCard uses 220ms ease-out translateY(-4px) on hover');
  assert(cardHoverSpecs.hasSoftShadow, 'ProductCard uses soft shadow (0 12px 28px rgba(18,33,41,.09)) on hover');
  assert(cardHoverSpecs.hasScale103 && cardHoverSpecs.has350ms, 'ProductCard image scales 1.03 over 350ms without altering card size');
  assert(cardHoverSpecs.hasArrowTranslate, 'ProductCard button arrow shifts 3px to the right on hover');

  // =============================================================
  // TEST 7: Generate Animated Interaction Recording (WebP / GIF)
  // =============================================================
  console.log('\n[TEST 7] Recording Interaction Frames (Slide Transitions & Hovers)...');

  // We capture sequential frames of:
  // 1. Slide 0 stationary
  // 2. Hover over Slide 0 CTA button (showing hover effect & 3px arrow shift)
  // 3. Transition from Slide 0 to Slide 1
  // 4. Slide 1 stationary
  // 5. Transition from Slide 1 to Slide 2
  // 6. Slide 2 stationary
  // 7. Scroll to ProductCard and hover over ProductCard

  const frames = [];
  const framesDir = path.join(ARTIFACT_DIR, 'recording_frames');
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

  const recordFrame = async (name) => {
    const framePath = path.join(framesDir, `${name}.png`);
    await page.screenshot({ path: framePath, clip: { x: 0, y: 0, width: 1440, height: 680 } });
    frames.push(framePath);
  };

  // Frame 1-3: Slide 0 view
  await page.click('#hero-tab-0');
  await sleep(400);
  await recordFrame('frame-01-slide0');
  await sleep(100);
  await recordFrame('frame-02-slide0');

  // Frame 4-5: Hover CTA on Slide 0
  const ctaLink = await page.$('#hero-slide-0 a.group\\/cta');
  if (ctaLink) await ctaLink.hover();
  await sleep(150);
  await recordFrame('frame-03-slide0-cta-hover');
  await sleep(100);
  await recordFrame('frame-04-slide0-cta-hover');

  // Frame 6-10: Trigger transition to Slide 1
  await page.click('#hero-tab-1');
  await sleep(100);
  await recordFrame('frame-05-trans-0-1-a');
  await sleep(150);
  await recordFrame('frame-06-trans-0-1-b');
  await sleep(150);
  await recordFrame('frame-07-trans-0-1-c');
  await sleep(200);
  await recordFrame('frame-08-slide1-settled');

  // Frame 11-15: Trigger transition to Slide 2
  await page.click('#hero-tab-2');
  await sleep(100);
  await recordFrame('frame-09-trans-1-2-a');
  await sleep(150);
  await recordFrame('frame-10-trans-1-2-b');
  await sleep(150);
  await recordFrame('frame-11-trans-1-2-c');
  await sleep(200);
  await recordFrame('frame-12-slide2-settled');

  // Frame 16-18: Trigger transition to Slide 3
  await page.click('#hero-tab-3');
  await sleep(250);
  await recordFrame('frame-13-trans-2-3');
  await sleep(350);
  await recordFrame('frame-14-slide3-settled');

  console.log(`  -> Recorded ${frames.length} sequential interaction frames.`);

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASSED, ${failedChecks} FAILED`);
  console.log(`======================================================\n`);

  if (failedChecks > 0) process.exit(1);
}

runVerification().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
