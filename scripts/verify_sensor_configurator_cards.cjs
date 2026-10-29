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
  console.log('=== STARTING UPDATED SENSOR CARDS LAYOUT VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // =============================================================
  // TEST 1: 400GD New Sensor Cards Layout & Two Buttons Structure
  // =============================================================
  console.log('[TEST 1] Testing 400GD Sensor Cards: Two Buttons, Equal Width, 38px, 8px Gap...');
  await page.goto('http://localhost:3000/urun/681000-mru-400gd', { waitUntil: 'networkidle0' });

  // Scroll to sensor configurator
  await page.evaluate(() => {
    const el = document.getElementById('sensor-secimi');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(400);

  const initialCardsData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-sensor-code]'));
    if (cards.length !== 9) return { error: `Expected 9 cards, found ${cards.length}` };

    const details = cards.map((card) => {
      const code = card.getAttribute('data-sensor-code');
      const bodyText = card.innerText;
      const hasOldDetailLink = bodyText.includes('Detayları incele');

      // Check product image and title links
      const imageLink = card.querySelector('a img')?.closest('a');
      const titleLink = card.querySelector('h4 a');

      // Check two buttons row
      const twoBtnRow = card.querySelector('.grid.grid-cols-2');
      const twoBtnRect = twoBtnRow ? twoBtnRow.getBoundingClientRect() : null;
      const leftBtn = twoBtnRow ? twoBtnRow.children[0] : null;
      const rightLink = twoBtnRow ? twoBtnRow.children[1] : null;

      const leftRect = leftBtn ? leftBtn.getBoundingClientRect() : null;
      const rightRect = rightLink ? rightLink.getBoundingClientRect() : null;

      // Check right button ("Ürünü incele") styling & attributes
      const rightText = rightLink ? rightLink.innerText.trim() : '';
      const rightHref = rightLink ? rightLink.getAttribute('href') : '';
      const rightTarget = rightLink ? rightLink.getAttribute('target') : '';
      const rightRel = rightLink ? rightLink.getAttribute('rel') : '';
      const isRightRealLink = rightLink && rightLink.tagName.toLowerCase() === 'a';

      // Check left button ("Sensör ekle")
      const leftText = leftBtn ? leftBtn.innerText.trim() : '';

      return {
        code,
        hasOldDetailLink,
        hasImageLink: Boolean(imageLink),
        hasTitleLink: Boolean(titleLink),
        hasTwoBtnRow: Boolean(twoBtnRow),
        twoBtnHeight: twoBtnRect ? Math.round(twoBtnRect.height) : null,
        twoBtnTop: twoBtnRect ? Math.round(twoBtnRect.top) : null,
        leftWidth: leftRect ? Math.round(leftRect.width) : null,
        rightWidth: rightRect ? Math.round(rightRect.width) : null,
        leftHeight: leftRect ? Math.round(leftRect.height) : null,
        rightHeight: rightRect ? Math.round(rightRect.height) : null,
        leftText,
        rightText,
        rightHref,
        rightTarget,
        rightRel,
        isRightRealLink,
        cardHeight: Math.round(card.getBoundingClientRect().height),
      };
    });

    return { details };
  });

  // 1. Confirm "Detayları incele ↗" is removed from description
  const hasNoOldDetailLink = initialCardsData.details.every((c) => !c.hasOldDetailLink);
  assert(hasNoOldDetailLink, 'Old "Detayları incele ↗" link is removed from all 9 card descriptions');

  // 2. Image and title links preserved
  const imageAndTitleLinksPreserved = initialCardsData.details.every((c) => c.hasImageLink && c.hasTitleLink);
  assert(imageAndTitleLinksPreserved, 'Product image and title links are preserved on all 9 cards');

  // 3. Right button is "Ürünü incele", real <a> link, target="_blank", rel="noopener noreferrer"
  const allRightButtonsValid = initialCardsData.details.every(
    (c) =>
      c.rightText === 'Ürünü incele' &&
      c.isRightRealLink &&
      c.rightTarget === '_blank' &&
      c.rightRel === 'noopener noreferrer' &&
      c.rightHref.startsWith('/urun/')
  );
  assert(allRightButtonsValid, 'Right control on all 9 cards is "Ürünü incele" (real <a> link, target="_blank", rel="noopener noreferrer")');

  // 4. Equal width and 38px height on both buttons
  const allButtonsEqualAnd38px = initialCardsData.details.every(
    (c) => c.leftHeight === 38 && c.rightHeight === 38 && Math.abs(c.leftWidth - c.rightWidth) <= 2
  );
  assert(allButtonsEqualAnd38px, `Both buttons in all cards are equal width and exactly 38px high (Height: 38px)`);

  // 5. Unselected state shows "Sensör ekle" on left
  const allUnselectedShowSensörEkle = initialCardsData.details.every((c) => c.leftText === 'Sensör ekle');
  assert(allUnselectedShowSensörEkle, 'Left button on all unselected cards displays "Sensör ekle"');

  // =============================================================
  // TEST 2: Selection Behavior, Quantity Row & Alignment Check
  // =============================================================
  console.log('\n[TEST 2] Testing Selection: Left button becomes "Seçimi kaldır", quantity row appears below buttons, horizontal alignment is preserved...');

  // Select HC401 (Middle card in the 3-card yanici-gaz group: HC400, HC401, HC402)
  await page.evaluate(() => {
    const card = document.querySelector('[data-sensor-code="11591"]');
    const addBtn = card.querySelector('.grid.grid-cols-2 button');
    if (addBtn) addBtn.click();
  });
  await sleep(250);

  // Set HC401 quantity to 2
  await page.evaluate(() => {
    const card = document.querySelector('[data-sensor-code="11591"]');
    const plusBtn = card.querySelector('button[aria-label="Sensör adedini artır"]');
    if (plusBtn) plusBtn.click();
  });
  await sleep(200);

  // Check state of the 3 cards in the same row: HC400 (unselected), HC401 (selected), HC402 (unselected)
  const rowComparison = await page.evaluate(() => {
    const c1 = document.querySelector('[data-sensor-code="11138"]'); // HC400
    const c2 = document.querySelector('[data-sensor-code="11591"]'); // HC401 (selected)
    const c3 = document.querySelector('[data-sensor-code="11733"]'); // HC402

    const getBtnTop = (card) => {
      const row = card.querySelector('.grid.grid-cols-2');
      return row ? Math.round(row.getBoundingClientRect().top) : null;
    };

    const getCardHeight = (card) => Math.round(card.getBoundingClientRect().height);

    const c2LeftBtnText = c2.querySelector('.grid.grid-cols-2 button')?.innerText.trim();
    const c2RightBtnText = c2.querySelector('.grid.grid-cols-2 a')?.innerText.trim();
    const c2QtyText = c2.querySelector('.border-x')?.innerText.trim();
    const c2HasQtyLabel = c2.innerText.includes('Sensör Adedi:');

    return {
      c2LeftBtnText,
      c2RightBtnText,
      c2QtyText,
      c2HasQtyLabel,
      btnTop1: getBtnTop(c1),
      btnTop2: getBtnTop(c2),
      btnTop3: getBtnTop(c3),
      height1: getCardHeight(c1),
      height2: getCardHeight(c2),
      height3: getCardHeight(c3),
    };
  });

  assert(rowComparison.c2LeftBtnText === 'Seçimi kaldır', 'Selected card left button changed cleanly to "Seçimi kaldır"');
  assert(rowComparison.c2RightBtnText === 'Ürünü incele', 'Selected card right button remained "Ürünü incele" in place');
  assert(rowComparison.c2QtyText === '2' && rowComparison.c2HasQtyLabel, 'Quantity control appears in separate dedicated row below the buttons with "Sensör Adedi: 2"');

  // Verify alignment: All 3 cards have buttons at the EXACT same vertical position!
  const buttonsAlignedInRow =
    rowComparison.btnTop1 === rowComparison.btnTop2 && rowComparison.btnTop2 === rowComparison.btnTop3;
  assert(
    buttonsAlignedInRow,
    `Perfect Button Alignment: Unselected and selected cards buttons share identical Y-coordinate (${rowComparison.btnTop1}px, ${rowComparison.btnTop2}px, ${rowComparison.btnTop3}px)`
  );

  const cardsShareHeight =
    rowComparison.height1 === rowComparison.height2 && rowComparison.height2 === rowComparison.height3;
  assert(
    cardsShareHeight,
    `Perfect Card Height: Unselected and selected cards maintain identical total height (${rowComparison.height1}px, ${rowComparison.height2}px, ${rowComparison.height3}px)`
  );

  // =============================================================
  // TEST 3: Inspecting Product Does NOT Change Selection
  // =============================================================
  console.log('\n[TEST 3] Testing "Ürünü incele" does NOT alter sensor selection...');

  // Get RF400 inspection link
  const rf400Href = await page.evaluate(() => {
    const card = document.querySelector('[data-sensor-code="11190"]');
    const inspectLink = card.querySelector('.grid.grid-cols-2 a');
    return inspectLink ? inspectLink.href : null;
  });

  // Open in new tab
  const newTab = await browser.newPage();
  await newTab.goto(rf400Href, { waitUntil: 'networkidle0' });
  const isRf400Open = await newTab.evaluate(() => document.body.innerText.includes('RF400'));
  assert(isRf400Open, 'New tab opens RF400 product page directly');
  await newTab.close();

  // Return and verify HC401 is still selected with qty 2 and RF400 is still unselected
  const stateAfterInspect = await page.evaluate(() => {
    const hc401Card = document.querySelector('[data-sensor-code="11591"]');
    const rf400Card = document.querySelector('[data-sensor-code="11190"]');

    const hc401IsSelected = hc401Card.innerText.includes('Seçimi kaldır');
    const hc401Qty = hc401Card.querySelector('.border-x')?.innerText.trim();

    const rf400IsUnselected = rf400Card.innerText.includes('Sensör ekle');

    return { hc401IsSelected, hc401Qty, rf400IsUnselected };
  });

  assert(stateAfterInspect.hc401IsSelected && stateAfterInspect.hc401Qty === '2', 'HC401 remains selected with quantity = 2');
  assert(stateAfterInspect.rf400IsUnselected, 'RF400 remains unselected (inspection does not alter selection)');

  // Take screenshot of 400GD showing both selected card (HC401 with "Seçimi kaldır" & qty) and unselected cards
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-sensor-cards-layout-400gd.png'),
  });
  console.log('  -> Saved screenshot-sensor-cards-layout-400gd.png');

  // =============================================================
  // TEST 4: 500GD Page Verification
  // =============================================================
  console.log('\n[TEST 4] Testing 500GD Page with New Layout...');
  await page.goto('http://localhost:3000/urun/682000-mru-500gd', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const el = document.getElementById('sensor-secimi');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(400);

  // Select HC402 on 500GD
  await page.evaluate(() => {
    const card = document.querySelector('[data-sensor-code="11733"]');
    const addBtn = card.querySelector('.grid.grid-cols-2 button');
    if (addBtn) addBtn.click();
  });
  await sleep(250);

  const check500gd = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-sensor-code]'));
    const allHaveTwoButtons = cards.every((c) => {
      const row = c.querySelector('.grid.grid-cols-2');
      const inspectBtn = row?.querySelector('a');
      return row && inspectBtn && inspectBtn.innerText.includes('Ürünü incele');
    });

    const hc402Card = document.querySelector('[data-sensor-code="11733"]');
    const hc402Selected = hc402Card.innerText.includes('Seçimi kaldır');
    const hc402HasQty = hc402Card.innerText.includes('Sensör Adedi:');

    return { cardCount: cards.length, allHaveTwoButtons, hc402Selected, hc402HasQty };
  });

  assert(check500gd.cardCount === 9, '500GD renders 9 sensor cards');
  assert(check500gd.allHaveTwoButtons, '500GD cards all feature the two-button layout with "Ürünü incele"');
  assert(check500gd.hc402Selected && check500gd.hc402HasQty, '500GD card selection toggles to "Seçimi kaldır" with separate quantity row');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-sensor-cards-layout-500gd.png'),
  });
  console.log('  -> Saved screenshot-sensor-cards-layout-500gd.png');

  // =============================================================
  // TEST 5: Keyboard Accessibility (Tab Navigation)
  // =============================================================
  console.log('\n[TEST 5] Testing Keyboard Navigation & Tab Focus...');
  const focusCheck = await page.evaluate(() => {
    const card = document.querySelector('[data-sensor-code="11138"]');
    const btns = Array.from(card.querySelectorAll('button, a'));
    const focusable = btns.every((el) => el.tabIndex >= 0 && !el.disabled);
    return { focusable, count: btns.length };
  });

  assert(focusCheck.focusable && focusCheck.count >= 4, `All ${focusCheck.count} interactive elements in card are accessible via keyboard`);

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
