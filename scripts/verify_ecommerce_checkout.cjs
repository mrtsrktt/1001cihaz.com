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

async function runEcommerceVerification() {
  console.log('=== STARTING E-COMMERCE & CHECKOUT VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // =============================================================
  // TEST 1: Unpriced Model 912212 (Satışa Kapalı, Fiyat/Teklif Yok)
  // =============================================================
  console.log('[TEST 1] Testing Unpriced Product 912212 ("Şu anda satışa kapalı")...');
  await page.goto('http://localhost:3000/urun/912212-mru-dm9600-7000-mbar', { waitUntil: 'networkidle0' });

  const product912212Data = await page.evaluate(() => {
    const bodyText = document.body.innerText.toLowerCase();
    const hasFiyatSorunuz = bodyText.includes('fiyat sorunuz');
    const hasTeklifIsteyin = bodyText.includes('teklif isteyin');
    const hasSatisaKapali = bodyText.includes('şu anda satışa kapalı');
    
    // Check main buy button
    const buttons = Array.from(document.querySelectorAll('button'));
    const closedBtn = buttons.find((b) => b.innerText.includes('Şu Anda Satışa Kapalı'));
    const isClosedBtnDisabled = closedBtn ? closedBtn.disabled : false;

    // Check sticky bottom bar when scrolled
    return {
      hasFiyatSorunuz,
      hasTeklifIsteyin,
      hasSatisaKapali,
      hasClosedBtn: Boolean(closedBtn),
      isClosedBtnDisabled,
    };
  });

  assert(product912212Data.hasSatisaKapali, 'Product 912212 displays "Şu anda satışa kapalı"');
  assert(!product912212Data.hasFiyatSorunuz, 'No "fiyat sorunuz" text on 912212 page');
  assert(!product912212Data.hasTeklifIsteyin, 'No "teklif isteyin" text on 912212 page');
  assert(product912212Data.hasClosedBtn && product912212Data.isClosedBtnDisabled, 'Main buy button is disabled ("Şu Anda Satışa Kapalı")');

  // Test sticky bar on 912212
  await page.evaluate(() => window.scrollTo(0, 900));
  await sleep(500);

  const sticky912212Data = await page.evaluate(() => {
    const bar = document.querySelector('[data-sticky-bottom-bar="true"]');
    if (!bar) return null;
    const text = bar.innerText;
    const btn = bar.querySelector('button[disabled]');
    return {
      hasBar: true,
      hasSatisaKapali: text.includes('Şu anda satışa kapalı'),
      hasDisabledBtn: Boolean(btn && btn.innerText.includes('Şu Anda Satışa Kapalı')),
      noMailto: !bar.querySelector('a[href^="mailto:"]'),
    };
  });

  assert(sticky912212Data?.hasSatisaKapali, 'Sticky bottom bar on 912212 displays "Şu anda satışa kapalı"');
  assert(sticky912212Data?.hasDisabledBtn, 'Sticky bottom bar buy button is disabled on 912212');
  assert(sticky912212Data?.noMailto, 'No mailto proposal link in sticky bottom bar');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-product-912212-closed.png'),
  });
  console.log('  -> Saved screenshot-product-912212-closed.png');

  // =============================================================
  // TEST 2: Cart Drawer E-Commerce Actions (Alışverişi Tamamla -> /odeme)
  // =============================================================
  console.log('\n[TEST 2] Testing Cart Drawer E-Commerce Actions...');

  // Add a priced product to cart (400GD + HC401)
  await page.goto('http://localhost:3000/urun/681000-mru-400gd', { waitUntil: 'networkidle0' });

  // Select sensor HC401
  await page.evaluate(() => {
    const btn = document.querySelector('[data-sensor-toggle="11591"]');
    if (btn) btn.click();
  });
  await sleep(300);

  // Click primary buy button
  await page.evaluate(() => {
    const buyBtn = document.querySelector('div[ref="topBuySectionRef"] button, div.mt-6 button.bg-\\[\\#C82B35\\]');
    if (buyBtn) buyBtn.click();
  });
  await sleep(400);

  // Inspect Cart Drawer
  const cartDrawerData = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    if (!drawer) return null;
    const text = drawer.innerText.toLowerCase();

    const hasDemoNotice = text.includes('demo sepetidir') || text.includes('gerçek ödeme alınmamaktadır');
    const hasPreorder = text.includes('ön sipariş');
    const hasProposalList = text.includes('teklif listesi');
    const hasFaturadaHesaplanir = text.includes('faturada hesaplanır');

    const title = drawer.querySelector('#cart-drawer-title')?.innerText.trim() || '';
    const checkoutBtn = drawer.querySelector('[data-checkout-btn="true"]');
    const checkoutBtnText = checkoutBtn?.innerText.trim() || '';
    const continueBtn = Array.from(drawer.querySelectorAll('button')).find((b) => b.innerText.includes('Alışverişe devam et'));

    const mailtoLink = drawer.querySelector('a[href^="mailto:"]');

    return {
      title,
      hasDemoNotice,
      hasPreorder,
      hasProposalList,
      hasFaturadaHesaplanir,
      hasCheckoutBtn: Boolean(checkoutBtn),
      checkoutBtnText,
      hasContinueBtn: Boolean(continueBtn),
      hasMailto: Boolean(mailtoLink),
    };
  });

  assert(cartDrawerData?.title?.startsWith('Sepetim'), 'Cart Drawer title is "Sepetim"', cartDrawerData?.title);
  assert(!cartDrawerData?.hasDemoNotice, 'No "demo sepetidir / gerçek ödeme alınmamaktadır" notices in cart drawer');
  assert(!cartDrawerData?.hasPreorder, 'No "ön sipariş" text in cart drawer');
  assert(!cartDrawerData?.hasProposalList, 'No "teklif listesi" text in cart drawer');
  assert(!cartDrawerData?.hasMailto, 'No mailto button in cart drawer');
  assert(cartDrawerData?.hasCheckoutBtn && cartDrawerData?.checkoutBtnText.includes('Alışverişi tamamla'), 'Primary button is "Alışverişi tamamla"');
  assert(cartDrawerData?.hasContinueBtn, 'Secondary link is "Alışverişe devam et"');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-cart-drawer-ecommerce.png'),
  });
  console.log('  -> Saved screenshot-cart-drawer-ecommerce.png');

  // Test "Alışverişe devam et" closes drawer
  await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    const continueBtn = Array.from(drawer.querySelectorAll('button')).find((b) => b.innerText.includes('Alışverişe devam et'));
    if (continueBtn) continueBtn.click();
  });
  await sleep(300);

  const isDrawerClosedAfterContinue = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-labelledby="cart-drawer-title"]');
    return !drawer || window.getComputedStyle(drawer).visibility === 'hidden';
  });
  assert(isDrawerClosedAfterContinue, 'Clicking "Alışverişe devam et" closes the cart drawer');

  // Re-open cart and test "Alışverişi tamamla" navigates to /odeme
  await page.evaluate(() => {
    const cartBtn = document.querySelector('button[aria-label="Sepeti aç"]');
    if (cartBtn) cartBtn.click();
  });
  await sleep(300);

  await page.evaluate(() => {
    const checkoutBtn = document.querySelector('[data-checkout-btn="true"]');
    if (checkoutBtn) checkoutBtn.click();
  });
  await sleep(400);

  const currentUrl = page.url();
  assert(currentUrl.endsWith('/odeme'), 'Clicking "Alışverişi tamamla" navigates cleanly to /odeme', currentUrl);

  // =============================================================
  // TEST 3: Checkout Page (/odeme) Structure & Empty Cart Protection
  // =============================================================
  console.log('\n[TEST 3] Testing Checkout Page (/odeme) Structure & Empty Cart Protection...');

  // Inspect 2-column layout on /odeme
  const checkoutLayoutData = await page.evaluate(() => {
    const form = document.getElementById('checkout-form');
    const summary = document.querySelector('aside');
    const bodyText = document.body.innerText.toLowerCase();

    return {
      hasForm: Boolean(form),
      hasSummary: Boolean(summary),
      hasStep1Contact: Boolean(document.getElementById('fullName') && document.getElementById('email') && document.getElementById('phone')),
      hasStep2Address: Boolean(document.getElementById('city') && document.getElementById('district') && document.getElementById('addressLine')),
      hasStep3Invoice: Boolean(document.querySelector('input[name="invoiceType"][value="individual"]') && document.querySelector('input[name="invoiceType"][value="corporate"]')),
      hasStep4Payment: Boolean(document.querySelector('input[placeholder="Kart Sahibi Ad Soyad"]')),
      hasTechnicalPaymentNotice: bodyText.includes('ödeme altyapısı entegrasyon bilgilendirmesi') || bodyText.includes('gerçek kredi kartı bilgisi toplanmamakta'),
      noFakePaymentSuccess: !bodyText.includes('siparişiniz başarıyla alındı') && !bodyText.includes('ödeme başarılı'),
    };
  });

  assert(checkoutLayoutData.hasForm, 'Checkout page displays multi-step form in left column');
  assert(checkoutLayoutData.hasSummary, 'Checkout page displays order summary in right column');
  assert(checkoutLayoutData.hasStep1Contact, 'Step 1 displays guest contact inputs (Ad Soyad, E-posta, Telefon)');
  assert(checkoutLayoutData.hasStep2Address, 'Step 2 displays delivery address inputs (İl, İlçe, Açık Adres)');
  assert(checkoutLayoutData.hasStep3Invoice, 'Step 3 displays invoice toggle (Bireysel / Kurumsal)');
  assert(checkoutLayoutData.hasStep4Payment, 'Step 4 displays payment method visual mock');
  assert(checkoutLayoutData.hasTechnicalPaymentNotice, 'Step 4 displays explicit technical payment integration notice');
  assert(checkoutLayoutData.noFakePaymentSuccess, 'No fake payment success or fabricated order messages shown');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-checkout-page-1440.png'),
  });
  console.log('  -> Saved screenshot-checkout-page-1440.png');

  // =============================================================
  // TEST 4: Corporate Invoice Toggle & Validation
  // =============================================================
  console.log('\n[TEST 4] Testing Corporate Invoice Toggle & Validation...');

  // Click Kurumsal Fatura
  await page.evaluate(() => {
    const corporateRadio = document.querySelector('input[name="invoiceType"][value="corporate"]');
    if (corporateRadio) corporateRadio.click();
  });
  await sleep(200);

  const corporateInputsData = await page.evaluate(() => {
    return {
      hasCompanyTitle: Boolean(document.getElementById('companyTitle')),
      hasTaxOffice: Boolean(document.getElementById('taxOffice')),
      hasTaxNumber: Boolean(document.getElementById('taxNumber')),
    };
  });

  assert(corporateInputsData.hasCompanyTitle, 'Company Title (Şirket Resmi Unvanı) input appears for corporate invoice');
  assert(corporateInputsData.hasTaxOffice, 'Tax Office (Vergi Dairesi) input appears for corporate invoice');
  assert(corporateInputsData.hasTaxNumber, 'Tax Number (VKN) input appears for corporate invoice');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot-checkout-corporate-invoice.png'),
  });
  console.log('  -> Saved screenshot-checkout-corporate-invoice.png');

  // Test form validation: submit with empty fields
  await page.evaluate(() => {
    const submitBtn = document.querySelector('[data-submit-order="true"]');
    if (submitBtn) submitBtn.click();
  });
  await sleep(250);

  const errorMessages = await page.evaluate(() => {
    const errors = Array.from(document.querySelectorAll('p.text-\\[\\#C82B35\\]'));
    return errors.map((e) => e.innerText.trim());
  });

  assert(errorMessages.length >= 6, `Form validation catches empty fields (Found ${errorMessages.length} validation errors)`);
  assert(errorMessages.some((m) => m.includes('ad ve soyad')), 'Validates full name requirement');
  assert(errorMessages.some((m) => m.includes('e-posta')), 'Validates email requirement');
  assert(errorMessages.some((m) => m.includes('telefon')), 'Validates phone requirement');
  assert(errorMessages.some((m) => m.includes('teslimat ilini')), 'Validates city requirement');
  assert(errorMessages.some((m) => m.includes('unvan')), 'Validates corporate company title requirement');
  assert(errorMessages.some((m) => m.includes('Vergi Kimlik Numarası') || m.includes('VKN')), 'Validates 10-digit VKN requirement');

  // Fill in valid data
  await page.type('#fullName', 'Ahmet Yılmaz');
  await page.type('#email', 'ahmet.yilmaz@endustri.com');
  await page.type('#phone', '05321234567');
  await page.type('#city', 'İstanbul');
  await page.type('#district', 'Pendik');
  await page.type('#addressLine', 'Sanayi Cad. No: 42 Daire: 5 Teknopark');
  await page.type('#companyTitle', 'ABC Endüstriyel Tesisat A.Ş.');
  await page.type('#taxOffice', 'Tuzla');
  await page.type('#taxNumber', '1234567890');
  await sleep(200);

  // Submit valid form
  await page.evaluate(() => {
    const submitBtn = document.querySelector('[data-submit-order="true"]');
    if (submitBtn) submitBtn.click();
  });
  await sleep(350);

  const isModalOpen = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
    const text = modal ? modal.innerText : '';
    return {
      isOpen: Boolean(modal),
      hasVerifiedTitle: text.includes('Sipariş Bilgileri Doğrulandı'),
      hasBuyerName: text.includes('Ahmet Yılmaz'),
      hasCompany: text.includes('ABC Endüstriyel Tesisat A.Ş.'),
      hasIntegrationNote: text.includes('Ödeme sağlayıcısı API bağlantısı henüz canlıya alınmadığından'),
    };
  });

  assert(isModalOpen.isOpen, 'Validation confirmation modal opens upon valid input submission');
  assert(isModalOpen.hasVerifiedTitle, 'Modal confirms "Sipariş Bilgileri Doğrulandı"');
  assert(isModalOpen.hasBuyerName && isModalOpen.hasCompany, 'Modal displays entered buyer and corporate invoice data');
  assert(isModalOpen.hasIntegrationNote, 'Modal explicitly clarifies payment gateway pending status (no fake charges)');

  // Close modal via "Bilgileri Düzenle"
  await page.evaluate(() => {
    const editBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Bilgileri Düzenle'));
    if (editBtn) editBtn.click();
  });
  await sleep(250);

  // =============================================================
  // TEST 5: State Preservation Across Navigation
  // =============================================================
  console.log('\n[TEST 5] Testing Form State Preservation Across Navigation...');

  // Navigate to catalog
  await page.goto('http://localhost:3000/kategori/tum-urunler', { waitUntil: 'networkidle0' });
  await sleep(300);

  // Navigate back to /odeme
  await page.goto('http://localhost:3000/odeme', { waitUntil: 'networkidle0' });
  await sleep(300);

  const preservedFormData = await page.evaluate(() => {
    return {
      fullName: document.getElementById('fullName')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      city: document.getElementById('city')?.value || '',
      companyTitle: document.getElementById('companyTitle')?.value || '',
      taxNumber: document.getElementById('taxNumber')?.value || '',
    };
  });

  assert(preservedFormData.fullName === 'Ahmet Yılmaz', 'Full name preserved after navigating away and returning');
  assert(preservedFormData.email === 'ahmet.yilmaz@endustri.com', 'Email preserved after navigating away and returning');
  assert(preservedFormData.phone === '05321234567', 'Phone preserved after navigating away and returning');
  assert(preservedFormData.city === 'İstanbul', 'City preserved after navigating away and returning');
  assert(preservedFormData.companyTitle === 'ABC Endüstriyel Tesisat A.Ş.', 'Corporate company title preserved');
  assert(preservedFormData.taxNumber === '1234567890', 'Corporate VKN preserved');

  // =============================================================
  // TEST 6: Empty Cart Protection on /odeme
  // =============================================================
  console.log('\n[TEST 6] Testing Empty Cart Protection on /odeme...');

  // Clear cart in localStorage
  await page.evaluate(() => {
    localStorage.removeItem('1001cihaz_cart');
    sessionStorage.removeItem('1001cihaz_checkout_form');
  });
  await page.goto('http://localhost:3000/odeme', { waitUntil: 'networkidle0' });
  await sleep(300);

  const emptyCartState = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasEmptyTitle: text.includes('Sepetiniz Boş'),
      hasBlockNotice: text.includes('Alışverişi tamamlama sayfasına geçebilmek için sepetinizde en az bir ürün bulunmalıdır'),
      hasCatalogBtn: Boolean(Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Ürün Kataloğuna Dön'))),
      noForm: !document.getElementById('checkout-form'),
    };
  });

  assert(emptyCartState.hasEmptyTitle, 'Empty cart displays "Sepetiniz Boş" title on /odeme');
  assert(emptyCartState.hasBlockNotice, 'Block notice explains that items are required to enter checkout');
  assert(emptyCartState.hasCatalogBtn, 'Provides button to return to catalog');
  assert(emptyCartState.noForm, 'Checkout form is completely blocked when cart is empty');

  // =============================================================
  // TEST 7: Single Source Commerce Config & Tax Calculations
  // =============================================================
  console.log('\n[TEST 7] Testing Single Source Commerce Config & Tax Calculations...');

  // Add 1x 400GD (14.375 TL)
  await page.evaluate(() => {
    localStorage.setItem('1001cihaz_cart', JSON.stringify([{ code: '681000', quantity: 1 }]));
  });
  await page.goto('http://localhost:3000/odeme', { waitUntil: 'networkidle0' });
  await sleep(300);

  const summaryTaxData = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return null;
    const text = aside.innerText;
    return {
      subtotal: text.includes('14.375 TL'),
      vatNotice: text.includes('Teyit bekliyor (Resmi orana göre hesaplanır)'),
      shippingNotice: text.includes('Kargo anlaşması teyidi bekleniyor'),
      noFabricatedTotal: text.includes('14.375 TL') && text.includes('+ KDV & Kargo (Nihai oranda)'),
    };
  });

  assert(summaryTaxData?.subtotal, 'Subtotal correctly calculates 14.375 TL for 1x 400GD');
  assert(summaryTaxData?.vatNotice, 'VAT calculation does not fabricate %20 or %18; indicates "Teyit bekliyor"');
  assert(summaryTaxData?.shippingNotice, 'Shipping fee does not fabricate zero or arbitrary fee; indicates confirmation pending');
  assert(summaryTaxData?.noFabricatedTotal, 'Total payable does not produce a false/fabricated numerical total');

  // =============================================================
  // FINAL REPORT & EXIT CODE
  // =============================================================
  console.log('\n======================================================');
  console.log(`E-COMMERCE VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASSED, ${failedChecks} FAILED`);
  console.log('======================================================');

  await browser.close();

  if (failedChecks > 0) {
    console.error(`\nProcess exiting with code 1 due to ${failedChecks} failed assertion(s).`);
    process.exit(1);
  } else {
    console.log('\nAll e-commerce and checkout assertions passed strictly with 100% success rate.');
    process.exit(0);
  }
}

runEcommerceVerification().catch((err) => {
  console.error('Unexpected e-commerce verification exception:', err);
  process.exit(1);
});
