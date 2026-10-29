import json
import os
import re

def sanitize_latex(text):
    if not isinstance(text, str):
        return text
    # Replace LaTeX chemical formulas with clean standard Unicode
    text = text.replace(r'($CH_4$)', '(CH₄)')
    text = text.replace(r'$CH_4$', 'CH₄')
    text = text.replace(r'($CO$)', '(CO)')
    text = text.replace(r'$CO$', 'CO')
    text = text.replace(r'($CO_2$)', '(CO₂)')
    text = text.replace(r'$CO_2$', 'CO₂')
    text = text.replace(r'($C_3H_8$)', '(C₃H₈)')
    text = text.replace(r'$C_3H_8$', 'C₃H₈')
    text = text.replace(r'($O_2$)', '(O₂)')
    text = text.replace(r'$O_2$', 'O₂')
    text = text.replace(r'($H_2$)', '(H₂)')
    text = text.replace(r'$H_2$', 'H₂')
    text = text.replace('O2-LL', 'O₂-LL')
    text = text.replace('H2 kompanzasyonlu', 'H₂ kompanzasyonlu')
    text = text.replace('H2 Kompanzasyonlu', 'H₂ Kompanzasyonlu')
    text = text.replace(r'$\leq$', '≤')
    text = text.replace(r'$\geq$', '≥')
    text = text.replace(r'$\pm$', '±')
    text = text.replace(r'\%', '%')
    # Strip any remaining unescaped dollar signs around single variables or words
    text = re.sub(r'\$([A-Za-z0-9_{}^]+)\$', r'\1', text)
    return text

def sanitize_deep(obj):
    if isinstance(obj, str):
        return sanitize_latex(obj)
    elif isinstance(obj, list):
        return [sanitize_deep(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: sanitize_deep(v) for k, v in obj.items()}
    return obj

with open('parsed_products.json', encoding='utf-8') as f:
    products = json.load(f)

# Sanitize all product data
products = sanitize_deep(products)

# Also save sanitized parsed_products.json so it stays clean
with open('parsed_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

CATEGORY_MAPPING = {
    '681000': ('Gaz Kaçak Dedektörleri', 'base_device', ['gaz-kacak-tespiti', 'sogutma-iklimlendirme']),
    '682000': ('Gaz Kaçak Dedektörleri', 'base_device', ['gaz-kacak-tespiti', 'sogutma-iklimlendirme']),
    '11138': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['gaz-kacak-tespiti']),
    '11591': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['gaz-kacak-tespiti']),
    '11733': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['gaz-kacak-tespiti']),
    '11190': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['sogutma-iklimlendirme']),
    '12130': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['gaz-kacak-tespiti', 'yanma-analizi']),
    '12623': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['sogutma-iklimlendirme']),
    '12121': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['sogutma-iklimlendirme', 'yanma-analizi']),
    '11922': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['sogutma-iklimlendirme']),
    '11191': ('Sensörler ve Ölçüm Başlıkları', 'sensor', ['yanma-analizi']),
    '912200': ('Dijital Manometreler', 'manometer', ['basinc-olcumu']),
    '912202': ('Dijital Manometreler', 'manometer', ['basinc-olcumu']),
    '912206': ('Dijital Manometreler', 'manometer', ['basinc-olcumu']),
    '912212': ('Dijital Manometreler', 'manometer', ['basinc-olcumu']),
    '690109': ('Baca Gazı Analiz Cihazları', 'set', ['yanma-analizi']),
    '420145': ('Baca Gazı Analiz Cihazları', 'set', ['yanma-analizi']),
}

SHORT_TITLES = {
    '681000': 'MRU 400GD Multifonksiyonel Gaz Dedektörü',
    '682000': 'MRU 500GD Pompalı Gaz Dedektörü',
    '11138': 'HC400 Metan (CH₄) Kaçak Sensörü',
    '11591': 'HC401 Metan & Propan Kaçak Sensörü',
    '11733': 'HC402 Çoklu Gaz Kaçak Sensörü (CH₄, C₃H₈, H₂)',
    '11190': 'RF400 Soğutucu Gaz (F-Gaz) Kaçak Sensörü',
    '12130': 'CO400 Ortam Karbonmonoksit Sensörü',
    '12623': 'CD400 Ortam Karbondioksit (CO₂) Sensörü',
    '12121': 'IR400 Kızılötesi Sıcaklık Sensörü',
    '11922': 'HM400 Sıcaklık, Nem & Basınç Sensörü',
    '11191': 'RM400 Egzoz Sızıntı & Geri Tepme Sensörü',
    '912200': 'DM9600 Hassas Dijital Manometre (±75 mbar)',
    '912202': 'DM9600 Hassas Dijital Manometre (±150 mbar)',
    '912206': 'DM9600 Hassas Dijital Manometre (±1.000 mbar)',
    '912212': 'DM9600 Yüksek Basınç Manometresi (±10 bar)',
    '690109': 'DELTAsmart SET LL Baca Gazı Analiz Seti',
    '420145': 'OPTIMA COA Profesyonel Baca Gazı Analiz Seti',
}

SENSOR_CODES = ['11138', '11591', '11733', '11190', '12130', '12623', '12121', '11922', '11191']
BASE_DEVICE_CODES = ['681000', '682000']

IMAGE_MAPPING = {
    '681000': ['/images/products/681000-400gd.png', '/images/products/681000-400gd-back.jpg', '/images/products/681000-400gd-sensors.jpg'],
    '682000': ['/images/products/682000-500gd.png', '/images/products/681000-682000-sensor-group.png'],
    '11138': ['/images/products/11138-hc400.jpg'],
    '11591': ['/images/products/11591-hc401.jpg'],
    '11733': ['/images/products/11733-hc402.jpg'],
    '11190': ['/images/products/11190-rf400.jpg'],
    '12130': ['/images/products/12130-co400.jpg', '/images/products/12130-co400-alt.jpg'],
    '12623': ['/images/products/12623-cd400.jpg'],
    '12121': ['/images/products/12121-ir400.jpg'],
    '11922': ['/images/products/11922-hm400.jpg'],
    '11191': ['/images/products/11191-rm400.jpg'],
    '912200': ['/images/products/dm9600-series.png'],
    '912202': ['/images/products/dm9600-series.png'],
    '912206': ['/images/products/dm9600-series.png'],
    '912212': ['/images/products/dm9600-series.png'],
    '690109': ['/images/products/690109-deltasmart-set.png', '/images/products/690109-deltasmart-device.png'],
    '420145': ['/images/products/420145-optima-coa-1.jpg', '/images/products/420145-optima-coa-2.jpg'],
}

MODEL_MAPPING = {
    '681000': 'MRU 400GD',
    '682000': 'MRU 500GD',
    '11138': 'MRU HC400',
    '11591': 'MRU HC401',
    '11733': 'MRU HC402',
    '11190': 'MRU RF400',
    '12130': 'MRU CO400',
    '12623': 'MRU CD400',
    '12121': 'MRU IR400',
    '11922': 'MRU HM400',
    '11191': 'MRU RM400',
    '912200': 'MRU DM9600 (±75 mbar)',
    '912202': 'MRU DM9600 (±150 mbar)',
    '912206': 'MRU DM9600 (±1.000 mbar)',
    '912212': 'MRU DM9600 (±10 bar)',
    '690109': 'MRU DELTAsmart SET LL',
    '420145': 'MRU OPTIMA COA Set',
}

SENSOR_PURPOSE_MAPPING = {
    '11138': 'yanici-gaz',       # HC400 Metan
    '11591': 'yanici-gaz',       # HC401 Metan & Propan
    '11733': 'yanici-gaz',       # HC402 Çoklu Gaz
    '11190': 'sogutucu-gaz',     # RF400 Soğutucu F-Gaz
    '12130': 'ortam-gazi',       # CO400 Karbonmonoksit
    '12623': 'ortam-gazi',       # CD400 Karbondioksit
    '12121': 'sicaklik-iklim',   # IR400 Kızılötesi Sıcaklık
    '11922': 'sicaklik-iklim',   # HM400 Sıcaklık, Nem & Basınç
    '11191': 'baca-geri-tepmesi',# RM400 Baca Geri Tepmesi & Egzoz
}

ts_output = '''/**
 * 1001cihaz.com - Yapılandırılmış Ürün Verisi (17 Başlangıç Ürünü)
 * Kaynak: TİCİMAX MANUEL ÜRÜN GİRİŞİ.docx & urun-gorselleri
 */

export type ProductType = 'base_device' | 'sensor' | 'manometer' | 'set';
export type ApplicationCategory = 'gaz-kacak-tespiti' | 'sogutma-iklimlendirme' | 'basinc-olcumu' | 'yanma-analizi';

export type SensorPurpose =
  | 'yanici-gaz'
  | 'sogutucu-gaz'
  | 'ortam-gazi'
  | 'sicaklik-iklim'
  | 'baca-geri-tepmesi';

export interface SensorPurposeDefinition {
  key: SensorPurpose;
  label: string;
  shortLabel: string;
  description: string;
}

export const SENSOR_PURPOSES: SensorPurposeDefinition[] = [
  {
    key: 'yanici-gaz',
    label: 'Yanıcı Gaz Kaçak Sensörleri',
    shortLabel: 'Yanıcı Gazlar',
    description: 'Doğal gaz, metan (CH₄), propan (C₃H₈) ve hidrojen (H₂) tesisatlarında patlayıcı gaz sızıntısı tespiti.',
  },
  {
    key: 'sogutucu-gaz',
    label: 'Soğutucu Gaz (F-Gaz) Sensörü',
    shortLabel: 'Soğutucu Gazlar',
    description: 'İklimlendirme ve soğutma sistemlerinde F-Gaz ve florlu akışkan kaçakları.',
  },
  {
    key: 'ortam-gazi',
    label: 'Ortam Güvenliği & Toksik Gazlar',
    shortLabel: 'Ortam Gazları',
    description: 'İç ortam havasında zehirli karbonmonoksit (CO) ve karbondioksit (CO₂) konsantrasyonu takibi.',
  },
  {
    key: 'sicaklik-iklim',
    label: 'Sıcaklık ve İklimlendirme',
    shortLabel: 'Sıcaklık & İklim',
    description: 'Temassız yüzey sıcaklığı ve bağıl nem/çiğ noktası ölçümleri.',
  },
  {
    key: 'baca-geri-tepmesi',
    label: 'Baca Geri Tepmesi ve Sızıntı',
    shortLabel: 'Baca Geri Tepmesi',
    description: 'Bacalı kazan ve yakıcı cihazlarda egzoz gazının ortama geri sızmasını tespit eder.',
  },
];

export interface SpecTable {
  headers: string[];
  rows: string[][];
}

export interface Product {
  id: string;
  code: string;
  name: string;
  shortTitle: string;
  brand: string;
  model: string;
  category: string;
  productType: ProductType;
  sensorPurpose?: SensorPurpose | null;
  requiresSensor: boolean;
  requiresSensorNotice?: string | null;
  compatibleProductCodes: string[];
  applications: ApplicationCategory[];
  shortDescription: string;
  description: string;
  features: string[];
  boxContent: string[];
  specTables: SpecTable[];
  listPrice: number | null;
  salePrice: number | null;
  currency: string;
  vatIncluded: boolean;
  images: string[];
  primaryImage: string;
  discrepancyNote?: string;
}

export const PRODUCTS: Product[] = [
'''

for p in products:
    code = p['code']
    cat, ptype, apps = CATEGORY_MAPPING.get(code, ('Diğer', 'sensor', []))
    requires_sensor = (ptype == 'base_device')
    requires_notice = (
        "Sensör dahil değildir. Cihazın çalışması için uyumlu bir sensör başlığı gereklidir. "
        "Mevcut uyumlu sensörünüz varsa baz ünite tek başına da sipariş edilebilir."
    ) if requires_sensor else None
    
    if ptype == 'base_device':
        compat = SENSOR_CODES
    elif ptype == 'sensor':
        compat = BASE_DEVICE_CODES
    else:
        compat = []
        
    imgs = IMAGE_MAPPING.get(code, [])
    primary_img = imgs[0] if imgs else '/images/placeholder.png'
    model = MODEL_MAPPING.get(code, code)
    short_title = SHORT_TITLES.get(code, model)
    
    discrepancy = None
    if code == '912212':
        discrepancy = "Kaynak DOCX dokümanında bu ürünün liste ve indirimli satış fiyatı belirtilmemiştir. Fiyat 'null' olarak tutulmaktadır."
    elif code == '690109':
        discrepancy = "Kaynak DOCX tablosunun 6. satırında 'Diferansiyel basınç' parametresinin birim ve aralığı '-40 ... +1.200 °C' ve doğruluk '± 2 °C veya %0,5' olarak yazılmıştır (sıcaklık birimleri basınç satırında yer almaktadır). Tablonun 9. satırında ise 'DiferansiyelBasınç' ayrıca '± 200 hPa (mbar)' olarak verilmiştir."
    elif code == '912206':
        discrepancy = "Tabloda Doğruluk (Accuracy) değeri '+/-350,00 hPa 0,3 hPa\\'ya kadar doğruluk veya % 0,5 ölçülen değer' olarak geçmektedir."
    elif code == '420145':
        discrepancy = "Set içeriği DOCX dosyasında 'Set İçeriği ve Öne Çıkan Özellikler' başlığı altında birleşik olarak verilmiştir."

    clean_tables = []
    for t in p['spec_tables']:
        if not t:
            continue
        headers = [sanitize_latex(h) for h in t[0]]
        rows = [[sanitize_latex(cell) for cell in r] for r in t[1:]]
        clean_tables.append({
            'headers': headers,
            'rows': rows
        })

    box_content = [sanitize_latex(b) for b in p['box_content']]
    if code == '420145':
        box_content = [
            "Analizör: OPTIMA COA yüksek performanslı analizör (4 yıl cihaz ve sensör garantili).",
            "Sensör Teknolojisi: 4-5 yıl ömürlü O₂-LL ve H₂ kompanzasyonlu CO (10.000 ppm) sensörleri.",
            "CO Sensör Koruması: Yüksek konsantrasyonlarda devreye giren otomatik sensör koruma pompası.",
            "Baca Gazı Probu: 250 mm boyunda, 650°C sıcaklığa dayanıklı paslanmaz çelik sonda ucu ve 2,7 metre uzunluğunda geniş erişim sağlayan hortumlu prob.",
            "Yazıcı: Infrared (Kızılötesi) kablosuz termal yazıcı (Saha raporlaması için).",
            "Filtre Sistemi: Teflon (PTFE) kaplamalı, yıkanabilir ve tekrar kullanılabilir filtreye sahip geniş yoğuşma haznesi.",
            "Haberleşme: Dahili Bluetooth ile ücretsiz MRU4U (iOS/Android) uygulaması üzerinden grafiksel raporlama.",
            "Taşıma Çantası: Tüm seti koruyan, dayanıklı ABS sert taşıma çantası.",
            "Sıcaklık ve Basınç: Ortam sıcaklık ölçümü ve ± 100 mbar hassas baca çekiş/fark basınç ölçümü.",
            "Ek Girişler: Fark sıcaklık ölçümü için 2 kanal K-tipi termokupl girişi.",
            "Batarya ve Şarj: 10 saate kadar kesintisiz analiz imkanı sunan Li-Ion batarya; USB üzerinden araçta veya 90-240V şebekede şarj imkanı.",
            "Aksesuarlar: Şarj adaptörü ve USB kablo, Ortam sıcaklık sensörü, Kullanma Kılavuzu, Kalibrasyon Sertifikası"
        ]

    sensor_purpose = SENSOR_PURPOSE_MAPPING.get(code, None)

    prod_obj = {
        'id': code,
        'code': code,
        'name': sanitize_latex(p['name']),
        'shortTitle': sanitize_latex(short_title),
        'brand': 'MRU GmbH',
        'model': model,
        'category': cat,
        'productType': ptype,
        'sensorPurpose': sensor_purpose,
        'requiresSensor': requires_sensor,
        'requiresSensorNotice': requires_notice,
        'compatibleProductCodes': compat,
        'applications': apps,
        'shortDescription': sanitize_latex(p['short_desc']),
        'description': sanitize_latex(p['detail_desc']),
        'features': [sanitize_latex(f_item) for f_item in p['features']],
        'boxContent': box_content,
        'specTables': clean_tables,
        'listPrice': p['list_price'],
        'salePrice': p['sale_price'],
        'currency': 'TL',
        'vatIncluded': False,
        'images': imgs,
        'primaryImage': primary_img,
    }
    if discrepancy:
        prod_obj['discrepancyNote'] = discrepancy
        
    ts_output += f"  {json.dumps(prod_obj, ensure_ascii=False, indent=2)},\n"

ts_output += '''];

export const CATEGORIES = [
  'Tüm ürünler',
  'Gaz kaçak dedektörleri',
  'Sensörler',
  'Manometreler',
  'Baca gazı analizörleri'
] as const;

export type NavCategory = (typeof CATEGORIES)[number];

export function matchesNavCategory(product: Product, cat: string): boolean {
  if (cat === 'Tüm ürünler' || cat === 'Tüm Ürünler') return true;
  if (cat === 'Gaz kaçak dedektörleri') return product.productType === 'base_device';
  if (cat === 'Sensörler') return product.productType === 'sensor';
  if (cat === 'Manometreler') return product.productType === 'manometer';
  if (cat === 'Baca gazı analizörleri') return product.productType === 'set';
  return product.category === cat;
}

export const APPLICATIONS = [
  {
    id: 'gaz-kacak-tespiti',
    title: 'Gaz Kaçak Tespiti',
    shortDesc: 'Doğal gaz, LPG, metan, hidrojen ve patlayıcı gaz sızıntılarının ultra hızlı ve güvenli tespiti.',
  },
  {
    id: 'sogutma-iklimlendirme',
    title: 'Soğutma ve İklimlendirme',
    shortDesc: 'HVAC-R sistemlerinde soğutucu akışkan (F-Gaz), iç hava kalitesi (CO2) ve termal konfor ölçümleri.',
  },
  {
    id: 'basinc-olcumu',
    title: 'Basınç Ölçümü',
    shortDesc: 'Kazan, brülör, gaz hattı ve filtrelerde yüksek kararlılıkta statik ve diferansiyel basınç takibi.',
  },
  {
    id: 'yanma-analizi',
    title: 'Yanma Analizi',
    shortDesc: 'Kazan ve yakma tesislerinde O2, CO emisyonları, baca çekişi ve yanma verimliliği hesaplanması.',
  }
] as const;
'''

os.makedirs('src/data', exist_ok=True)
with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_output)

print('Successfully regenerated src/data/products.ts with sanitized typography and zero LaTeX')
