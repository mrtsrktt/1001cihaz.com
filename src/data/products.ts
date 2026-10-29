/**
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
  {
  "id": "681000",
  "code": "681000",
  "name": "MRU 400GD Multifonksiyonel Gaz Dedektörü ve Ölçüm Cihazı (Baz Cihaz, Sensör Dahil Değildir)",
  "shortTitle": "MRU 400GD Multifonksiyonel Gaz Dedektörü",
  "brand": "MRU GmbH",
  "model": "MRU 400GD",
  "category": "Gaz Kaçak Dedektörleri",
  "productType": "base_device",
  "sensorPurpose": null,
  "requiresSensor": true,
  "requiresSensorNotice": "Sensör dahil değildir. Cihazın çalışması için uyumlu bir sensör başlığı gereklidir. Mevcut uyumlu sensörünüz varsa baz ünite tek başına da sipariş edilebilir.",
  "compatibleProductCodes": [
    "11138",
    "11591",
    "11733",
    "11190",
    "12130",
    "12623",
    "12121",
    "11922",
    "11191"
  ],
  "applications": [
    "gaz-kacak-tespiti",
    "sogutma-iklimlendirme"
  ],
  "shortDescription": "Akıllı sensör yapısı, TFT renkli ekranı ve QR kod raporlama özelliği ile gaz kaçak tespiti ve ortam ölçümlerinde profesyonel çözümler sunan multifonksiyonel ana ünite.",
  "description": "MRU 400GD, esnek kullanım imkanı sunan multifonksiyonel bir baz cihazdır. Sensörsüz olarak sunulan bu ana ünite, \"tak-kullan\" teknolojisine sahip akıllı sensörleri otomatik olarak tanıma özelliğine sahiptir. Bu sayede cihazı ihtiyacınıza göre farklı gaz algılama veya ortam ölçüm görevleri için özelleştirebilirsiniz. Toza karşı korumalı tuş takımı ve dayanıklı yapısı ile zorlu saha koşullarında güvenilir performans sunar.",
  "features": [
    "Akıllı Sensör Teknolojisi: Otomatik algılanan tak-kullan sensör yapısı ile hızlı kurulum ve sensörler arası kolay geçiş sağlar.",
    "Gelişmiş Alarm Sistemi: Kullanıcı tarafından ayarlanabilen alarm seviyeleri; akustik, optik ve titreşimli uyarılar ile desteklenmiştir.",
    "Dijital Veri Yönetimi: Ölçüm sonuçları QR kod üzerinden görüntülenebilir ve mobil cihazlar aracılığıyla hızlıca e-posta olarak paylaşılabilir.",
    "Kullanıcı Dostu Arayüz: Yüksek çözünürlüklü TFT renkli ekranı sayesinde tüm veriler kolayca okunabilir.",
    "Dayanıklı Batarya: Dahili Li-Ion bataryası ile uzun süreli kesintisiz saha kullanımı sunar."
  ],
  "boxContent": [
    "MRU 400GD Baz Ünite",
    "Şarj Cihazı ve Kablosu",
    "Süngerli Taşıma Çantası"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Detay"
      ],
      "rows": [
        [
          "Ekran",
          "45 mm (1.8\") TFT"
        ],
        [
          "Arayüz (Şarj / Firmware)",
          "Mini-USB"
        ],
        [
          "Dahili Batarya / Çalışma Süresi",
          "Li-Ion, 20 saate kadar (Sensöre bağlı olarak)"
        ],
        [
          "Güç Kaynağı / Tüketim",
          "100 ... 240 V, 5 V DC, 500 mA"
        ],
        [
          "Çalışma Koşulları",
          "+5 ... +50 °C"
        ],
        [
          "Saklama Koşulları",
          "-20 ... +60 °C"
        ],
        [
          "Bağıl Nem",
          "%95 (Yoğuşmasız)"
        ],
        [
          "Koruma Sınıfı",
          "IP30"
        ],
        [
          "Boyutlar (GxYxD)",
          "50 x 135 x 35 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 230 g"
        ]
      ]
    }
  ],
  "listPrice": 22220,
  "salePrice": 14375,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/681000-400gd.png",
    "/images/products/681000-400gd-back.jpg",
    "/images/products/681000-400gd-sensors.jpg"
  ],
  "primaryImage": "/images/products/681000-400gd.png"
},
  {
  "id": "682000",
  "code": "682000",
  "name": "MRU 500GD Pompalı Multifonksiyonel Gaz Dedektörü ve Ölçüm Cihazı (Baz Cihaz, Sensör Dahil Değildir)",
  "shortTitle": "MRU 500GD Pompalı Gaz Dedektörü",
  "brand": "MRU GmbH",
  "model": "MRU 500GD",
  "category": "Gaz Kaçak Dedektörleri",
  "productType": "base_device",
  "sensorPurpose": null,
  "requiresSensor": true,
  "requiresSensorNotice": "Sensör dahil değildir. Cihazın çalışması için uyumlu bir sensör başlığı gereklidir. Mevcut uyumlu sensörünüz varsa baz ünite tek başına da sipariş edilebilir.",
  "compatibleProductCodes": [
    "11138",
    "11591",
    "11733",
    "11190",
    "12130",
    "12623",
    "12121",
    "11922",
    "11191"
  ],
  "applications": [
    "gaz-kacak-tespiti",
    "sogutma-iklimlendirme"
  ],
  "shortDescription": "Entegre pompa yapısı sayesinde 1.5 saniyenin altındaki tepki süresiyle en hızlı gaz kaçak tespiti ve ortam ölçümlerini gerçekleştiren profesyonel baz ünite.",
  "description": "MRU 500GD, yüksek performanslı entegre pompası ile standart dedektörlerden ayrılan, profesyonel kullanıma yönelik multifonksiyonel bir ana ünitedir. Pompalı yapısı, gazın sensöre çok daha hızlı ulaştırılmasını sağlayarak 1.5 saniyenin altında ultra hızlı tepki süresi sunar. Tak-kullan teknolojisine sahip akıllı sensörleri otomatik olarak tanıyan bu cihaz, saha operasyonlarınızda size hem hız hem de esneklik kazandırır.",
  "features": [
    "Yüksek Hızlı Pompa Sistemi: Entegre pompası ile numune gazı hızlıca emer ve 1.5 saniyeden kısa sürede sonuç verir.",
    "Akıllı Sensör Uyumluluğu: Otomatik algılanan tak-kullan sensör yapısı ile farklı ölçüm görevleri arasında saniyeler içinde geçiş imkanı sağlar.",
    "Üçlü Alarm Sistemi: Eşik değerleri aşıldığında kullanıcıyı akustik, optik ve titreşimli olarak uyarır.",
    "Gelişmiş Veri Paylaşımı: Ölçüm sonuçlarını anlık olarak QR kod ile görüntüleyebilir, e-posta yoluyla raporlarınızı hızla paylaşabilirsiniz.",
    "Endüstriyel Dayanıklılık: Toza karşı korumalı tuş takımı ve TFT renkli ekranı ile zorlu saha koşulları için idealdir."
  ],
  "boxContent": [
    "MRU 500GD Pompalı Baz Ünite",
    "Şarj Cihazı ve Kablosu",
    "Süngerli Taşıma Çantası"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Detay"
      ],
      "rows": [
        [
          "Ekran",
          "45 mm (1.8\") TFT"
        ],
        [
          "Tepki Süresi",
          "< 1.5 saniye (Pompa yardımıyla)"
        ],
        [
          "Arayüz (Şarj / Firmware)",
          "Mini-USB"
        ],
        [
          "Dahili Batarya / Çalışma Süresi",
          "Li-Ion, 20 saate kadar (Sensöre bağlı olarak)"
        ],
        [
          "Güç Kaynağı / Tüketim",
          "100 ... 240 V, 5 V DC, 500 mA"
        ],
        [
          "Çalışma / Saklama Koşulları",
          "+5...+50 °C / -20...+60 °C"
        ],
        [
          "Koruma Sınıfı",
          "IP30"
        ],
        [
          "Boyutlar (GxYxD)",
          "50 x 163 x 25 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 220 g"
        ]
      ]
    }
  ],
  "listPrice": 30580,
  "salePrice": 20125,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/682000-500gd.png",
    "/images/products/681000-682000-sensor-group.png"
  ],
  "primaryImage": "/images/products/682000-500gd.png"
},
  {
  "id": "11138",
  "code": "11138",
  "name": "HC400 Patlayıcı Kaçak Sensörü (CH4 Kalibreli)",
  "shortTitle": "HC400 Metan (CH₄) Kaçak Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU HC400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "yanici-gaz",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "gaz-kacak-tespiti"
  ],
  "shortDescription": "MRU 400GD ve 500GD serisi ile uyumlu, metan (CH₄) gazı kaçaklarını %100 LEL seviyesine kadar hassasiyetle tespit eden profesyonel \"tak-kullan\" sensör başlığı.",
  "description": "HC400, endüstriyel ve evsel tesisatlarda oluşabilecek patlayıcı gaz kaçaklarını tespit etmek için tasarlanmış yüksek hassasiyetli bir sensör başlığıdır. Metan (CH₄) gazı için özel olarak kalibre edilmiştir. Akıllı sensör yapısı sayesinde ana üniteye takıldığı anda otomatik olarak tanınır ve hızlıca ölçüme başlar.",
  "features": [
    "Geniş Ölçüm Skalası: 0'dan 22.000 ppm seviyesine kadar geniş bir aralıkta güvenilir sonuçlar sağlar.",
    "Çoklu Birim Desteği: Ölçüm sonuçlarını ihtiyaca göre ppm, % (hacimsel) ve % LEL (Alt Patlama Limiti) birimlerinde görüntüleyebilir.",
    "Hızlı Tepki: Kaçak tespitinde kritik olan tepki süresi ≤ 3 saniye ile sınırlandırılmıştır.",
    "Tak-Kullan Yapı: MRU 400GD ve 500GD ana üniteleri ile tam uyumlu olup, sahada hızlı değişim imkanı sunar.",
    "Uyumlu Cihazlar:",
    "MRU 400GD Multifonksiyonel Gaz Dedektörü",
    "MRU 500GD Pompalı Multifonksiyonel Gaz Dedektörü"
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Sensör Kriterleri",
        "Tanım",
        "Ölçüm Aralığı",
        "Hassasiyet",
        "Tepki Süresi"
      ],
      "rows": [
        [
          "CH4 Sensör (Gaz Kaçak)",
          "HC400/401/402",
          "0 ... 22.000 ppm",
          "1 ppm",
          "≤ 3 sn"
        ]
      ]
    }
  ],
  "listPrice": 8415,
  "salePrice": 5750,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11138-hc400.jpg"
  ],
  "primaryImage": "/images/products/11138-hc400.jpg"
},
  {
  "id": "11591",
  "code": "11591",
  "name": "HC401 Patlayıcı Kaçak Sensörü (CH4 ve C3H8 Algılama)",
  "shortTitle": "HC401 Metan & Propan Kaçak Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU HC401",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "yanici-gaz",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "gaz-kacak-tespiti"
  ],
  "shortDescription": "Metan (CH4) ve Propan (C3H8) gazlarını tek bir \"tak-kullan\" başlıkta algılayabilen, %100 LEL seviyesine kadar hassas ölçüm sunan profesyonel kaçak sensörü.",
  "description": "HC401, hem doğal gaz (Metan) hem de LPG (Propan) tesisatlarında güvenle kullanılabilen hibrit bir sensör başlığıdır. MRU 400GD ve 500GD serisi ana ünitelerle otomatik senkronize olan bu akıllı sensör, patlayıcı gazların Alt Patlama Limitini (LEL) hassas bir şekilde izlemenizi sağlar.",
  "features": [
    "Çift Gaz Algılama: Tek bir sensör ile hem Metan hem de Propan kaçaklarını tespit edebilir.",
    "Geniş Ölçüm Aralığı: Patlayıcı gazların %100 LEL seviyesine kadar olan tüm yoğunluğunu ppm veya yüzde cinsinden takip eder.",
    "Hızlı ve Akıllı: Sensör takıldığı anda cihaz tarafından tanınır.",
    "Esnek Birim Seçimi: Ölçüm değerlerini ppm, % (hacimsel) ve % LEL birimleri arasında dönüştürebilir."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Sensör Kriterleri",
        "Ölçüm Aralığı",
        "Hassasiyet",
        "Tepki Süresi"
      ],
      "rows": [
        [
          "Metan (CH4)",
          "0 ... 22.000 ppm",
          "1 ppm",
          "≤ 3 sn"
        ],
        [
          "Propan (C3H8)",
          "0 ... 8.500 ppm*",
          "1 ppm",
          "≤ 3 sn"
        ]
      ]
    }
  ],
  "listPrice": 9900,
  "salePrice": 6765,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11591-hc401.jpg"
  ],
  "primaryImage": "/images/products/11591-hc401.jpg"
},
  {
  "id": "11733",
  "code": "11733",
  "name": "HC402 Patlayıcı Kaçak Sensörü (CH4, C3H8, H2 Algılama)",
  "shortTitle": "HC402 Çoklu Gaz Kaçak Sensörü (CH₄, C₃H₈, H₂)",
  "brand": "MRU GmbH",
  "model": "MRU HC402",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "yanici-gaz",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "gaz-kacak-tespiti"
  ],
  "shortDescription": "Metan, Propan ve Hidrojen gazlarını tek bir \"tak-kullan\" başlıkta algılayabilen, %100 LEL seviyesine kadar hassas ölçüm sunan en üst segment kaçak sensörü.",
  "description": "HC402, MRU'nun multifonksiyonel gaz dedektörleri için geliştirdiği en gelişmiş sensör başlığıdır. Doğal gaz ve LPG'nin yanı sıra, endüstriyel tesislerde kritik önem taşıyan Hidrojen (H2) kaçaklarını da tespit edebilir. Akıllı sensör teknolojisi sayesinde ana üniteye takıldığı anda tüm gaz türleri için otomatik olarak kalibre olur.",
  "features": [
    "Üçlü Gaz Algılama: Tek bir sensör başlığı ile Metan (CH4), Propan (C3H8) ve Hidrojen (H2) kaçaklarını saptayabilir.",
    "Geniş ve Hassas Ölçüm: Her üç gaz türü için de %100 LEL (Alt Patlama Limiti) seviyesine kadar 1 ppm hassasiyetle ölçüm yapar.",
    "Hızlı Müdahale: Hidrojen kaçaklarında dahi 5 saniyenin altında tepki süresi ile güvenliği en üst düzeye çıkarır.",
    "Esnek Birim Seçimi: Kullanıcı tercihine göre sonuçları ppm, % (hacimsel) ve % LEL olarak görüntüler.",
    "Uyumlu Cihazlar:",
    "MRU 400GD Multifonksiyonel Gaz Dedektörü",
    "MRU 500GD Pompalı Multifonksiyonel Gaz Dedektörü"
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Gaz Türü",
        "Ölçüm Aralığı",
        "Hassasiyet",
        "Tepki Süresi"
      ],
      "rows": [
        [
          "Metan (CH4)",
          "0 ... 22.000 ppm",
          "1 ppm",
          "≤ 3 sn"
        ],
        [
          "Propan (C3H8)",
          "0 ... 8.500 ppm",
          "1 ppm",
          "≤ 3 sn"
        ],
        [
          "Hidrojen (H2)",
          "0 ... 20.000 ppm",
          "1 ppm",
          "≤ 5 sn"
        ]
      ]
    }
  ],
  "listPrice": 11715,
  "salePrice": 8000,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11733-hc402.jpg"
  ],
  "primaryImage": "/images/products/11733-hc402.jpg"
},
  {
  "id": "11190",
  "code": "11190",
  "name": "RF400 Soğutucu Kaçak Sensörü",
  "shortTitle": "RF400 Soğutucu Gaz (F-Gaz) Kaçak Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU RF400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "sogutucu-gaz",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "sogutma-iklimlendirme"
  ],
  "shortDescription": "R134a, R32 ve R410a dahil olmak üzere 30'dan fazla soğutucu gazı 1 ppm hassasiyetle algılayabilen, profesyonel iklimlendirme ve soğutma sistemleri için tasarlanmış tak-kullan sensör başlığı.",
  "description": "RF400, soğutma ve iklimlendirme sistemlerinde meydana gelen en küçük sızıntıları bile tespit etmek için geliştirilmiş ileri teknoloji bir sensördür. CFC, HCFC, PFC, HFC ve HFO grubu soğutucu akışkanların tamamına yakınına tepki verir. DIN EN 14624 standartlarına uygunluğu ile profesyonel servislerin vazgeçilmez ekipmanıdır.",
  "features": [
    "Geniş Gaz Uyumluluğu: R134a, R32, R410a ve yeni nesil R1234ze gibi popüler gazların yanı sıra toplamda 30'un üzerinde soğutucu akışkanı algılar.",
    "Yüksek Hassasiyet: 1 ppm çözünürlük ve yılda sadece 1 gram sızıntıyı (1 g/yıl) yakalayabilme kapasitesi ile en zorlu kaçakları bile saptar.",
    "Ultra Hızlı Tepki: Sızıntı noktasına yaklaşıldığında 1,5 saniyeden kısa sürede sinyal üretir.",
    "Endüstriyel Standart: Uluslararası DIN EN 14624 standartlarına tam uyumludur."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Tanımlama / Değer"
      ],
      "rows": [
        [
          "Tanım",
          "RF Sensörü"
        ],
        [
          "Referans Soğutucu Gazlar",
          "R134a, H2, R410a, R1234ze (R32 uyumlu)"
        ],
        [
          "Soğutucu Tespit Grupları",
          "CFC, HCFC, PFC, HFC, HFO"
        ],
        [
          "Ölçüm Aralığı / Çözünürlük",
          "0 ... 1.000 ppm / 1 ppm"
        ],
        [
          "Tespit Limiti",
          "1 g/yıl (R134a, R1234yf, R290 için)"
        ],
        [
          "Tepki Süresi",
          "≤ 1,5 sn"
        ],
        [
          "Uygunluk",
          "DIN EN 14624"
        ]
      ]
    }
  ],
  "listPrice": 13860,
  "salePrice": 8625,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11190-rf400.jpg"
  ],
  "primaryImage": "/images/products/11190-rf400.jpg"
},
  {
  "id": "12130",
  "code": "12130",
  "name": "CO400 Ortam Karbonmonoksit (CO) Kaçak Sensörü",
  "shortTitle": "CO400 Ortam Karbonmonoksit Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU CO400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "ortam-gazi",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "gaz-kacak-tespiti",
    "yanma-analizi"
  ],
  "shortDescription": "Ortam havasındaki sessiz tehlike karbonmonoksit (CO) gazını 1 ppm hassasiyetle anlık olarak takip eden, MRU 400GD/500GD uyumlu profesyonel \"tak-kullan\" sensör başlığı.",
  "description": "CO400, renksiz, kokusuz ve zehirli bir gaz olan karbonmonoksitin ortamdaki varlığını tespit etmek için tasarlanmıştır. Yüksek hassasiyetli elektrokimyasal sensörü sayesinde, insan sağlığı için risk oluşturabilecek en düşük seviyeleri bile hızla algılar. Kazan daireleri, kapalı park alanları ve endüstriyel tesislerde ortam havası denetimi için idealdir.",
  "features": [
    "Yüksek Hassasiyetli Ölçüm: 0’dan 1.000 ppm’e kadar olan geniş aralıkta 1 ppm çözünürlükle doğru sonuçlar sunar.",
    "İSG Uyumluluğu: Ortam havası güvenliği denetimlerinde profesyonel standartları karşılar.",
    "Hızlı Algılama: Kritik sızıntı durumlarında 30 saniyenin altında tepki süresi ile güvenliği sağlar.",
    "Tak-Kullan Pratikliği: MRU 400/500GD dedektörleri tarafından saniyeler içinde otomatik olarak tanınır."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Tanımlama / Değer"
      ],
      "rows": [
        [
          "Tanım",
          "CO400 Ortam Karbonmonoksit Ölçümü"
        ],
        [
          "Ölçüm Aralığı",
          "0 ... 1.000 ppm"
        ],
        [
          "Hassasiyet (Çözünürlük)",
          "1 ppm"
        ],
        [
          "Tepki Süresi (T90)",
          "< 30 sn"
        ]
      ]
    }
  ],
  "listPrice": 13090,
  "salePrice": 8950,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/12130-co400.jpg",
    "/images/products/12130-co400-alt.jpg"
  ],
  "primaryImage": "/images/products/12130-co400.jpg"
},
  {
  "id": "12623",
  "code": "12623",
  "name": "CD400 Ortam Karbondioksit (CO2) Sensörü",
  "shortTitle": "CD400 Ortam Karbondioksit (CO₂) Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU CD400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "ortam-gazi",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "sogutma-iklimlendirme"
  ],
  "shortDescription": "İç mekan hava kalitesini ve havalandırma verimliliğini takip etmek için tasarlanmış, 400 ile 10.000 ppm aralığında hassas ölçüm yapan MRU 400GD/500GD uyumlu \"tak-kullan\" sensör başlığı.",
  "description": "CD400, özellikle ofisler, okullar ve endüstriyel tesisler gibi kapalı alanlarda karbondioksit yoğunluğunu ölçmek için idealdir. Ortamdaki CO2 seviyesini izleyerek havalandırma sistemlerinin performansını denetlemenize ve sağlıklı bir nefes alma ortamı sağlamanıza yardımcı olur. Akıllı sensör yapısı sayesinde MRU ana üniteleriyle tam entegre çalışır.",
  "features": [
    "Geniş Ölçüm Skalası: 400 ppm'den 10.000 ppm'e kadar olan konsantrasyonları takip edebilir.",
    "Yüksek Çözünürlük: 1 ppm hassasiyet ile ortam havasındaki en küçük değişimleri dahi raporlar.",
    "Hava Kalitesi Denetimi: İç mekanlarda CO2 bazlı taze hava kontrolü (IAQ) için profesyonel çözümdür.",
    "Pratik Kullanım: Tak-kullan yapısı sayesinde kalibrasyon ayarı gerektirmeden hızla ölçüme başlar."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Tanımlama / Değer"
      ],
      "rows": [
        [
          "Tanım",
          "CD400 Karbondioksit Ölçümü"
        ],
        [
          "Ölçüm Aralığı",
          "400 ... 10.000 ppm"
        ],
        [
          "Hassasiyet (Çözünürlük)",
          "1 ppm"
        ],
        [
          "Tepki Süresi (T90)",
          "90 sn."
        ]
      ]
    }
  ],
  "listPrice": 20790,
  "salePrice": 14200,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/12623-cd400.jpg"
  ],
  "primaryImage": "/images/products/12623-cd400.jpg"
},
  {
  "id": "12121",
  "code": "12121",
  "name": "IR400 Kızılötesi (Infrared) Sıcaklık Sensörü",
  "shortTitle": "IR400 Kızılötesi Sıcaklık Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU IR400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "sicaklik-iklim",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "sogutma-iklimlendirme",
    "yanma-analizi"
  ],
  "shortDescription": "-70 °C ile +380 °C aralığında temassız sıcaklık ölçümü yapabilen, 35° geniş görüş açısına sahip MRU 400GD/500GD uyumlu profesyonel \"tak-kullan\" sensör başlığı.",
  "description": "IR400, infrared teknolojisi sayesinde yüzeylere dokunmadan uzaktan sıcaklık tespiti yapmanızı sağlar. Geniş ölçüm aralığı sayesinde hem çok düşük sıcaklıktaki sistemlerde hem de yüksek sıcaklıklı endüstriyel ekipmanlarda güvenle kullanılabilir. Akıllı sensör yapısı, ana üniteye takıldığı anda otomatik olarak devreye girer ve anlık veri akışı sağlar.",
  "features": [
    "Geniş Ölçüm Aralığı: -70 °C'den +380 °C'ye kadar çok geniş bir spektrumda hassas ölçüm imkanı sunar.",
    "Temassız Ölçüm Güvenliği: Sıcak veya dönen parçalara yaklaşmadan, kızılötesi ışınlar yardımıyla güvenli mesafeden veri toplar.",
    "Optik Çözünürlük (FOV): 35° görüş alanı ile hedef bölgeyi geniş bir açıyla tarayarak hızlı sonuç verir.",
    "Hassas Okuma: 0,1 °C çözünürlüğü sayesinde yüzey sıcaklıklarındaki en ufak değişimleri dahi tespit eder."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Tanımlama / Değer"
      ],
      "rows": [
        [
          "Tanım",
          "IR400 Sıcaklık Ölçümü"
        ],
        [
          "Ölçüm Aralığı",
          "-70 ... +380 °C"
        ],
        [
          "Hassasiyet (Çözünürlük)",
          "0,1 °C"
        ],
        [
          "Görüş Alanı (FOV)",
          "35°"
        ]
      ]
    }
  ],
  "listPrice": 10505,
  "salePrice": 7180,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/12121-ir400.jpg"
  ],
  "primaryImage": "/images/products/12121-ir400.jpg"
},
  {
  "id": "11922",
  "code": "11922",
  "name": "HM400 Ortam Sıcaklık, Nem ve Basınç Sensörü (İç Mekan İklimi)",
  "shortTitle": "HM400 Sıcaklık, Nem & Basınç Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU HM400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "sicaklik-iklim",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "sogutma-iklimlendirme"
  ],
  "shortDescription": "Nem, sıcaklık, barometrik basınç ve çiğ noktası değerlerini tek bir \"tak-kullan\" başlıkta sunan, MRU 400GD/500GD uyumlu çok amaçlı iklimlendirme sensörü.",
  "description": "HM400, iç mekan konfor şartlarının ve hava kalitesinin (IAQ) kapsamlı analizi için tasarlanmıştır. Akıllı sensör yapısı sayesinde ana üniteye takıldığı anda bağıl nem, ortam sıcaklığı ve atmosferik basınç verilerini eş zamanlı olarak ekrana taşır. Ayrıca, ölçülen nem ve sıcaklık değerlerini kullanarak çiğleşme noktası (dew point) sıcaklığını otomatik olarak hesaplar.",
  "features": [
    "Dörtlü Veri Takibi: Tek bir sensörle nem, sıcaklık, basınç ve çiğ noktası değerlerine anlık erişim sağlar.",
    "Geniş Basınç Aralığı: 300 hPa ile 1.100 hPa arasındaki barometrik basınç değişimlerini 0,1 hPa çözünürlükle izler.",
    "Otomatik Hesaplama: Çiğleşme noktası değerini kullanıcı müdahalesine gerek kalmadan matematiksel modelleme ile sunar.",
    "Yüksek Hassasiyet: Hem nem hem de sıcaklık ölçümlerinde 0,1 birimlik çözünürlük ile profesyonel raporlama imkanı tanır."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Ölçüm Parametresi",
        "Ölçüm Aralığı",
        "Çözünürlük"
      ],
      "rows": [
        [
          "Bağıl Nem",
          "0 ... 100 % RH",
          "0,1 %"
        ],
        [
          "Sıcaklık",
          "0 ... +60 °C",
          "0,1 °C"
        ],
        [
          "Barometrik Basınç",
          "300 ... 1.100 hPa",
          "0,1 hPa"
        ],
        [
          "Çiğ Noktası",
          "Nem ve sıcaklıktan hesaplanır",
          "-"
        ]
      ]
    }
  ],
  "listPrice": 6325,
  "salePrice": 4320,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11922-hm400.jpg"
  ],
  "primaryImage": "/images/products/11922-hm400.jpg"
},
  {
  "id": "11191",
  "code": "11191",
  "name": "RM400 Döküntü ve Sızıntı Test Sensörü (Egzoz Geri Tepme)",
  "shortTitle": "RM400 Egzoz Sızıntı & Geri Tepme Sensörü",
  "brand": "MRU GmbH",
  "model": "MRU RM400",
  "category": "Sensörler ve Ölçüm Başlıkları",
  "productType": "sensor",
  "sensorPurpose": "baca-geri-tepmesi",
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [
    "681000",
    "682000"
  ],
  "applications": [
    "yanma-analizi"
  ],
  "shortDescription": "Egzoz boruları ve bacalarda oluşan gaz sızıntılarını ve geri tepme (spillage) durumunu 1 saniyenin altında tespit eden, MRU 400GD/500GD uyumlu güvenlik sensörü.",
  "description": "RM400, ısıtma sistemlerinde baca çekişinin yetersiz olması durumunda atık gazın ortama geri sızıp sızmadığını (Döküntü/Spillage) kontrol etmek için tasarlanmıştır. Özellikle kazan dairelerinde karbonmonoksit zehirlenmelerinin önüne geçmek amacıyla yapılan baca güvenlik testlerinde kullanılır. Sensör, egzoz borusu veya davlumbaz kenarındaki sızıntıyı anlık olarak algılayarak kullanıcıyı uyarır.",
  "features": [
    "Hayati Güvenlik Testi: Baca gazının ortama sızma riskini (Geri Tepme) profesyonelce denetler.",
    "Ultra Hızlı Tepki: Sızıntı durumunu 1 saniyenin altında (< 1 sn) algılayarak anında müdahale imkanı sağlar.",
    "Hassas Algılama: 0 ile 100 arasındaki referans aralığında 1 birim çözünürlükle detaylı analiz yapar.",
    "Tak-Kullan Yapı: MRU 400/500GD dedektörlere takıldığı anda otomatik olarak \"Spillage Test\" modunu aktif eder."
  ],
  "boxContent": [],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Tanımlama / Değer"
      ],
      "rows": [
        [
          "Tanım",
          "RM400 Dökülme (Sızıntı) Testi"
        ],
        [
          "Ölçüm Aralığı",
          "0 ... 100 (Referans Değer)"
        ],
        [
          "Çözünürlük",
          "1 birim"
        ],
        [
          "Tepki Süresi (T90)",
          "< 1 sn."
        ]
      ]
    }
  ],
  "listPrice": 6050,
  "salePrice": 4130,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/11191-rm400.jpg"
  ],
  "primaryImage": "/images/products/11191-rm400.jpg"
},
  {
  "id": "912200",
  "code": "912200",
  "name": "DM9600 Hassas Dijital Manometre (± 75 mbar)",
  "shortTitle": "DM9600 Hassas Dijital Manometre (±75 mbar)",
  "brand": "MRU GmbH",
  "model": "MRU DM9600 (±75 mbar)",
  "category": "Dijital Manometreler",
  "productType": "manometer",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "basinc-olcumu"
  ],
  "shortDescription": "2.8\" renkli dokunmatik ekranı, ± 75 mbar hassas ölçüm aralığı, SD kart ile veri kaydı özelliği ve sıcaklık ölçüm girişleri ile profesyonel fark basınç manometresi.",
  "description": "MRU DM9600, endüstriyel ve HVAC uygulamaları için geliştirilmiş, yüksek stabiliteye sahip sensörlerle donatılmış profesyonel bir dijital manometredir. ± 75 hPa (mbar) aralığında, 0,1 Pa gibi çok yüksek bir çözünürlükle ölçüm yapabilir. Sağlam cam elyaf (glass-fiber) takviyeli kasası ve arka yüzeyindeki güçlü mıknatıslar, zorlu saha koşullarında eller serbest çalışmanıza olanak tanır. Sadece anlık ölçüm yapmakla kalmaz; dahili hafızası ve SD kart desteği sayesinde verileri CSV formatında kaydedebilir, MRU4win yazılımı ile bilgisayar üzerinden online izleme yapabilirsiniz.",
  "features": [
    "Hassas ve Stabil: ± 75 mbar aralığında yüksek doğrulukla basınç ve fark basınç ölçümü.",
    "Dokunmatik Renkli Ekran: 2,8\" büyüklüğündeki TFT dokunmatik ekranı ile modern ve kolay kullanım.",
    "Çift Sıcaklık Girişi: 2 adet K-tipi termokupl girişi ile basınçla eş zamanlı sıcaklık takibi (Birimler: °C, °F).",
    "Gelişmiş Veri Kaydı: Dahili hafızanın yanı sıra SD karta CSV formatında uzun süreli kayıt, Min/Max takibi ve programlanabilir ortalama alma özelliği.",
    "Çoklu Birim Desteği: hPa, mbar, bar, psi, mmHg, inHg, cmH2O, inH2O birimlerinde gösterim.",
    "Bağlantı Arayüzleri: USB üzerinden şarj ve veri transferi, kablosuz yazıcılar için Infrared arayüz, opsiyonel Bluetooth.",
    "Saha Dayanıklılığı: Cam elyaf takviyeli sağlam kasa ve metal yüzeylere sabitleme için mıknatıslı arka yüzey."
  ],
  "boxContent": [
    "DM9600 Dijital Manometre",
    "1,5 m Silikon Hortum (⌀ 6 x 2 mm)",
    "Şarj Adaptörü ve USB Kablosu",
    "Kullanım Kılavuzu"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Değer / Açıklama"
      ],
      "rows": [
        [
          "Ölçüm Aralığı",
          "± 75 hPa (mbar)"
        ],
        [
          "Doğruluk (Accuracy)",
          "± 2 Pa abs. veya % 0,5 (ölçülen değerin)"
        ],
        [
          "Çözünürlük",
          "0,1 Pa"
        ],
        [
          "Sıcaklık Kararlılığı",
          "± % 0,4 (0 ... 50 °C aralığında)"
        ],
        [
          "Ekran",
          "2,8\" Dokunmatik Renkli Ekran"
        ],
        [
          "Batarya",
          "Güçlü Li-Ion Batarya"
        ],
        [
          "Boyutlar (G x Y x D)",
          "82 x 169 x 36 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 400 g"
        ],
        [
          "Arayüzler",
          "Mini-USB, Micro-SD, IR (Yazıcı için)"
        ]
      ]
    }
  ],
  "listPrice": 25190,
  "salePrice": 17210,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/dm9600-series.png"
  ],
  "primaryImage": "/images/products/dm9600-series.png"
},
  {
  "id": "912202",
  "code": "912202",
  "name": "MRU DM9600 Hassas Dijital Manometre (± 150 mbar)",
  "shortTitle": "DM9600 Hassas Dijital Manometre (±150 mbar)",
  "brand": "MRU GmbH",
  "model": "MRU DM9600 (±150 mbar)",
  "category": "Dijital Manometreler",
  "productType": "manometer",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "basinc-olcumu"
  ],
  "shortDescription": "± 150 mbar ölçüm aralığı, 0,01 hPa yüksek çözünürlüğü, renkli dokunmatik ekranı ve veri kayıt özellikleri ile endüstriyel hassasiyet sunan profesyonel fark basınç manometresi.",
  "description": "MRU DM9600, endüstriyel ve HVAC uygulamaları için geliştirilmiş, yüksek stabiliteye sahip sensörlerle donatılmış profesyonel bir dijital manometredir. ± 150 hPa (mbar) aralığında, 0,01 hPa gibi çok yüksek bir çözünürlükle hassas ölçüm yapabilir. Sağlam cam elyaf (glass-fiber) takviyeli kasası ve arka yüzeyindeki güçlü mıknatıslar, zorlu saha koşullarında eller serbest çalışmanıza olanak tanır. Sadece anlık ölçüm yapmakla kalmaz; dahili hafızası ve SD kart desteği sayesinde verileri CSV formatında kaydedebilir, MRU4win yazılımı ile bilgisayar üzerinden online izleme yapabilirsiniz.",
  "features": [
    "Hassas Ölçüm: ± 150 mbar aralığında yüksek doğrulukla basınç ve fark basınç ölçümü yapar.",
    "Dokunmatik Renkli Ekran: 2,8\" büyüklüğündeki TFT dokunmatik ekranı ile modern ve kolay kullanım sağlar.",
    "Çift Sıcaklık Girişi: 2 adet K-tipi termokupl girişi ile basınçla eş zamanlı sıcaklık takibi yapabilir (Birimler: °C, °F).",
    "Gelişmiş Veri Kaydı: Dahili hafızanın yanı sıra SD karta CSV formatında uzun süreli kayıt, Min/Max takibi ve programlanabilir ortalama alma özelliğine sahiptir.",
    "Çoklu Birim Desteği: hPa, mbar, bar, psi, mmHg, inHg, cmH2O, inH2O birimlerinde gösterim imkanı sunar.",
    "Bağlantı Arayüzleri: USB üzerinden şarj ve veri transferi, kablosuz yazıcılar için Infrared arayüz ve opsiyonel Bluetooth desteği mevcuttur.",
    "Saha Dayanıklılığı: Cam elyaf takviyeli sağlam kasa ve metal yüzeylere sabitleme için mıknatıslı arka yüzeye sahiptir."
  ],
  "boxContent": [
    "DM9600 Dijital Manometre (± 150 mbar)",
    "1,5 m Silikon Hortum (⌀ 6 x 2 mm)",
    "Şarj Adaptörü ve USB Kablosu",
    "Kullanım Kılavuzu"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Değer / Açıklama"
      ],
      "rows": [
        [
          "Ölçüm Aralığı",
          "± 150 hPa (mbar)"
        ],
        [
          "Doğruluk (Accuracy)",
          "± 0,03 hPa abs. veya % 0,5 (ölçülen değerin)"
        ],
        [
          "Çözünürlük",
          "0,01 hPa"
        ],
        [
          "Sıcaklık Kararlılığı",
          "± % 0,4 (0 ... 50 °C aralığında)"
        ],
        [
          "Ekran",
          "2,8\" Dokunmatik Renkli Ekran"
        ],
        [
          "Batarya",
          "Güçlü Li-Ion Batarya"
        ],
        [
          "Boyutlar (G x Y x D)",
          "82 x 169 x 36 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 400 g"
        ],
        [
          "Arayüzler",
          "Mini-USB, Micro-SD, IR (Yazıcı için)"
        ]
      ]
    }
  ],
  "listPrice": 25575,
  "salePrice": 17475,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/dm9600-series.png"
  ],
  "primaryImage": "/images/products/dm9600-series.png"
},
  {
  "id": "912206",
  "code": "912206",
  "name": "MRU DM9600 Hassas Dijital Manometre (± 1.000 mbar)",
  "shortTitle": "DM9600 Hassas Dijital Manometre (±1.000 mbar)",
  "brand": "MRU GmbH",
  "model": "MRU DM9600 (±1.000 mbar)",
  "category": "Dijital Manometreler",
  "productType": "manometer",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "basinc-olcumu"
  ],
  "shortDescription": "± 1.000 mbar (1 Bar) geniş ölçüm kapasitesi, yüksek hassasiyeti ve renkli dokunmatik ekranı ile endüstriyel basınç testleri için ideal, veri kayıt özellikli profesyonel manometre.",
  "description": "MRU DM9600 (1 Bar), yüksek basınç aralıklarında hassas ölçüm gerektiren endüstriyel uygulamalar ve gaz hatları için özel olarak yapılandırılmıştır. ± 1.000 hPa (mbar) seviyesine kadar olan basınç ve fark basınç değerlerini 0,1 hPa çözünürlükle analiz eder. Sağlam cam elyaf (glass-fiber) takviyeli kasası, arka yüzeyindeki güçlü mıknatıslar ve 2.8 inçlik dokunmatik ekranı ile sahada en ergonomik kullanımı sunar. Dahili hafızası ve SD kart desteği sayesinde, uzun süreli sızdırmazlık testlerini kaydedebilir ve CSV formatında raporlayabilirsiniz.",
  "features": [
    "Geniş Ölçüm Kapasitesi: ± 1.000 mbar (1 Bar) aralığına kadar güvenilir ölçüm yapar.",
    "Dokunmatik Renkli Ekran: 2,8\" büyüklüğündeki TFT dokunmatik ekranı ile verileri okumak ve cihazı yönetmek çok kolaydır.",
    "Çift Sıcaklık Girişi: 2 adet K-tipi termokupl girişi ile basınç değişimlerini sıcaklık farklarıyla birlikte izleme imkanı sunar.",
    "Gelişmiş Veri Kaydı: Dahili hafıza ve SD kart desteği ile verileri CSV formatında kaydeder; Min/Max ve ortalama değerleri hesaplar.",
    "Çoklu Birim Desteği: hPa, mbar, bar, psi, mmHg, inHg, cmH2O, inH2O gibi farklı birimler arasında anında geçiş yapılabilir.",
    "Bağlantı Arayüzleri: Şarj ve veri transferi için Mini-USB, kablosuz yazıcılar için Infrared arayüz ve opsiyonel Bluetooth desteği bulunur.",
    "Saha Dayanıklılığı: Zorlu koşullara dayanıklı gövdesi ve eller serbest çalışma imkanı sunan mıknatıs özelliği ile işinizi kolaylaştırır."
  ],
  "boxContent": [
    "DM9600 Dijital Manometre (± 1.000 mbar)",
    "1,5 m Silikon Hortum (⌀ 6 x 2 mm)",
    "Şarj Adaptörü ve USB Kablosu",
    "Kullanım Kılavuzu"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Değer / Açıklama"
      ],
      "rows": [
        [
          "Ölçüm Aralığı",
          "± 1.000 hPa (mbar)"
        ],
        [
          "Doğruluk (Accuracy)",
          "+/-350,00 hPa 0,3 hPa'ya kadar doğruluk veya % 0,5 ölçülen değer"
        ],
        [
          "Çözünürlük",
          "0,1 hPa"
        ],
        [
          "Sıcaklık Kararlılığı",
          "± % 0,5 (0 ... 50 °C aralığında)"
        ],
        [
          "Ekran",
          "2,8\" Dokunmatik Renkli Ekran"
        ],
        [
          "Batarya",
          "Güçlü Li-Ion Batarya"
        ],
        [
          "Boyutlar (G x Y x D)",
          "82 x 169 x 36 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 400 g"
        ],
        [
          "Arayüzler",
          "Mini-USB, Micro-SD, IR (Yazıcı için)"
        ]
      ]
    }
  ],
  "listPrice": 24365,
  "salePrice": 16650,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/dm9600-series.png"
  ],
  "primaryImage": "/images/products/dm9600-series.png",
  "discrepancyNote": "Tabloda Doğruluk (Accuracy) değeri '+/-350,00 hPa 0,3 hPa\\'ya kadar doğruluk veya % 0,5 ölçülen değer' olarak geçmektedir."
},
  {
  "id": "912212",
  "code": "912212",
  "name": "MRU DM9600 Yüksek Basınç Dijital Manometre (± 10 bar / 150 PSI)",
  "shortTitle": "DM9600 Yüksek Basınç Manometresi (±10 bar)",
  "brand": "MRU GmbH",
  "model": "MRU DM9600 (±10 bar)",
  "category": "Dijital Manometreler",
  "productType": "manometer",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "basinc-olcumu"
  ],
  "shortDescription": "± 10 bar (150 PSI) yüksek basınç ölçüm kapasitesi, dayanıklı yapısı ve renkli dokunmatik ekranı ile endüstriyel tesisat testleri için tasarlanmış profesyonel dijital manometre.",
  "description": "MRU DM9600 (10 bar), yüksek basınçlı sistemlerin denetimi ve fark basınç ölçümleri için geliştirilmiş en güçlü modeldir. ± 10 bar seviyesine kadar olan basınç değerlerini 1 hPa çözünürlükle ölçebilir. Sağlam cam elyaf (glass-fiber) takviyeli kasası ve arka yüzeyindeki güçlü mıknatısları sayesinde en zorlu endüstriyel sahalarda güvenli kullanım sunar. Dokunmatik ekranı ve veri kayıt özellikleri (SD Kart/CSV) ile karmaşık sızdırmazlık testlerini kolayca dijitalleştirmenizi sağlar.",
  "features": [
    "Yüksek Basınç Kapasitesi: ± 10 bar (150 PSI) aralığına kadar geniş bir spektrumda güvenli ölçüm imkanı sunar.",
    "Dokunmatik Renkli Ekran: 2,8\" büyüklüğündeki TFT dokunmatik ekranı ile veriler net okunur ve menü yönetimi hızlıdır.",
    "Çift Sıcaklık Girişi: 2 adet K-tipi termokupl girişi ile basınç ölçümü yaparken eş zamanlı olarak ortam veya yüzey sıcaklığını izleyebilir.",
    "Dijital Kayıt ve Analiz: Dahili hafıza ve SD kart desteği ile verileri CSV formatında kaydeder, Min/Max ve ortalama değerleri otomatik hesaplar.",
    "Çoklu Birim Seçeneği: bar, psi, hPa, mbar, mmHg, inHg, cmH2O, inH2O birimleri arasında kolayca geçiş yapabilir.",
    "Kullanışlı Bağlantılar: USB üzerinden şarj ve veri transferi yapabilir; opsiyonel yazıcılar için Infrared (IR) arayüzüne sahiptir.",
    "Saha Ergonomisi: Mıknatıslı yapısı ile metal yüzeylere tutunur ve dayanıklı gövdesiyle uzun ömürlü kullanım sağlar."
  ],
  "boxContent": [
    "DM9600 Dijital Manometre (± 10 bar)",
    "1,5 m Silikon Hortum (⌀ 6 x 2 mm)",
    "Şarj Adaptörü ve USB Kablosu",
    "Kullanım Kılavuzu",
    "ALT KATEGORİ: Eltipi Analizörler"
  ],
  "specTables": [
    {
      "headers": [
        "Özellik",
        "Değer / Açıklama"
      ],
      "rows": [
        [
          "Ölçüm Aralığı",
          "± 10.000 hPa (10 bar / 150 PSI)"
        ],
        [
          "Doğruluk (Accuracy)",
          "1,0 hPa veya ölçülen değerin % 1'i (Hangisi büyükse)"
        ],
        [
          "Çözünürlük",
          "1 hPa"
        ],
        [
          "Ekran",
          "2,8\" Dokunmatik Renkli Ekran"
        ],
        [
          "Batarya",
          "Güçlü Li-Ion Batarya"
        ],
        [
          "Boyutlar (G x Y x D)",
          "82 x 169 x 36 mm"
        ],
        [
          "Ağırlık",
          "Yaklaşık 400 g"
        ],
        [
          "Arayüzler",
          "Mini-USB, Micro-SD, IR (Yazıcı için), Bluetooth (Opsiyonel)"
        ]
      ]
    }
  ],
  "listPrice": null,
  "salePrice": null,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/dm9600-series.png"
  ],
  "primaryImage": "/images/products/dm9600-series.png",
  "discrepancyNote": "Kaynak DOCX dokümanında bu ürünün liste ve indirimli satış fiyatı belirtilmemiştir. Fiyat 'null' olarak tutulmaktadır."
},
  {
  "id": "690109",
  "code": "690109",
  "name": "MRU DELTAsmart SET LL - 4 Yıl Garantili Baca Gazı Analiz Cihazı Seti (Infrared Yazıcılı, Bluetoothlu, Çantalı)",
  "shortTitle": "DELTAsmart SET LL Baca Gazı Analiz Seti",
  "brand": "MRU GmbH",
  "model": "MRU DELTAsmart SET LL",
  "category": "Baca Gazı Analiz Cihazları",
  "productType": "set",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "yanma-analizi"
  ],
  "shortDescription": "4 yıl garantili uzun ömürlü sensörler, renkli dokunmatik ekran, dahili Bluetooth ve Infrared yazıcı desteği ile baca gazı analizinde eksiksiz, profesyonel çözüm seti.",
  "description": "MRU DELTAsmart (E Versiyon), ısıtma sistemlerinin servis, bakım ve kurulum süreçleri için optimize edilmiş, kompakt ve güçlü bir baca gazı analizörüdür. Uzun ömürlü (Long-Life) sensör yapısı sayesinde sensör değişim maliyetlerini minimize ederken, H₂ kompanzasyonlu CO sensörü ile en doğru sonuçları sunar. Renkli dokunmatik ekranı, kullanıcı dostu arayüzü ve güçlü Li-Ion bataryası ile sahada maksimum verimlilik sağlar. Bu set; analizörün yanı sıra Infrared yazıcı, taşıma çantası ve tüm gerekli aksesuarları içeren tam bir çözüm paketidir.",
  "features": [
    "Uzun Ömürlü Sensörler: O2 ve H₂ kompanzasyonlu CO sensörleri 4 yıl garantilidir.",
    "Dokunmatik Ekran: 2,8\" TFT renkli dokunmatik ekran ile kolay menü yönetimi.",
    "Gelişmiş Veri Transferi: Dahili Bluetooth üzerinden akıllı telefon, tablet veya PC'ye anlık veri aktarımı.",
    "Hassas Basınç Ölçümü: ± 200 mbar aralığında diferansiyel basınç ve baca çekişi ölçümü.",
    "Kapsamlı Hesaplamalar: CO2, verimlilik, fazla hava, çiğleşme noktası ve ısıl kayıp (qA) değerlerini otomatik hesaplar.",
    "Dayanıklı Yapı: Cam elyaf takviyeli sağlam kasa ve arka yüzeyde güçlü tutunma için mıknatıslar.",
    "Geniş Kayıt Kapasitesi: 1.000 ölçüm noktasına kadar dahili kayıt hafızası ve Micro-SD kart desteği.",
    "Hesaplamalar ve Diğer Bilgiler"
  ],
  "boxContent": [
    "Analizör: DELTAsmart E versiyon analizör (4 yıl garantili sensör yapısı ile).",
    "Sensörler: O₂-LL ve H₂ kompanzasyonlu CO-LL (0-10.000 ppm) uzun ömürlü sensörler.",
    "Baca Gazı Probu: 250 mm boyunda, 8 mm çapında paslanmaz çelik sonda ucu ve 1,5 metre uzunluğunda esnek hortumlu prob.",
    "Yazıcı: Infrared (Kızılötesi) kablosuz termal yazıcı (Saha raporlaması için).",
    "Taşıma Çantası: Tüm ekipmanı koruyan, darbelere dayanıklı ABS sert taşıma çantası.",
    "Haberleşme: Dahili Bluetooth (Akıllı telefon/tablet bağlantısı için) ve IRDA arayüzü.",
    "Sıcaklık Ölçümü: K tipi ortam sıcaklık sensörü dahildir.",
    "Şarj ve Veri: USB şarj cihazı ve Mini-USB kablo",
    "Bakım: Yedek partikül filtresi"
  ],
  "specTables": [
    {
      "headers": [
        "Ölçülen Değerler",
        "Ölçüm Aralığı",
        "Çözünürlük",
        "Doğruluk"
      ],
      "rows": [
        [
          "O2",
          "0 ... 21,0 Vol.-% mutlak",
          "%0,1",
          "± 0,2 Vol.-% mutlak"
        ],
        [
          "CO (H₂ kompanzasyonlu)",
          "0 ... 4.000 ppm (aşırı yüklenme 10.000 ppm)",
          "1 ppm",
          "± 10 ppm veya %5 ölçülen değer (< 4.000 ppm)"
        ],
        [
          "CO",
          "0 ... 10.000 ppm (aşırı yüklenme 20.000 ppm)",
          "1 ppm",
          "± 20 ppm veya %5 ölçülen değer (< 4.000 ppm)"
        ],
        [
          "NO (opsiyonel)",
          "0 ... 5.000 ppm (aşırı yüklenme 10.000 ppm)",
          "1 ppm",
          "± 5 ppm veya %5 ölçülen değer (< 5.000 ppm)"
        ],
        [
          "Baca gazı sıcaklığı",
          "-40 ... +1.200 °C",
          "0,1 °C",
          "± 2 °C (< 200 °C), %1 ölçülen değer (> 200 °C)"
        ],
        [
          "Diferansiyel basınç",
          "-40 ... +1.200 °C",
          "0,1 °C",
          "± 2 °C veya %0,5"
        ],
        [
          "Yanma havası sıcaklığı",
          "0 ... +100 °C",
          "0,1 °C",
          "± 2 °C"
        ],
        [
          "Baca çekişi",
          "± 200 hPa (mbar)",
          "0,01 hPa",
          "± 0,02 hPa (mbar) veya %1"
        ],
        [
          "DiferansiyelBasınç",
          "± 200 hPa (mbar)",
          "0,01 hPa",
          "± 0,02 hPa (mbar) veya %1"
        ]
      ]
    },
    {
      "headers": [
        "Parametre",
        "Detay"
      ],
      "rows": [
        [
          "Yanma hesaplamaları",
          "CO2, fazla hava, verimlilik, çiğleşme noktası, CO ortam havası ölçümü, sızıntı testi"
        ],
        [
          "Yakıtlar",
          "Doğal gaz, hafif yağ, sıvı gaz, pelet ve daha fazlası"
        ],
        [
          "CO2 (Hesaplanan)",
          "0 ... CO2 max. (Ölçüm aralığı), %0,1 (Çözünürlük), ± 0,3 Vol.-% mutlak (Doğruluk)"
        ],
        [
          "Kayıt Hafızası",
          "1.000 ölçü, 1.000 ölçüm noktası"
        ],
        [
          "Arayüzler",
          "Mini-USB, Micro-SD, IRDA, Bluetooth"
        ],
        [
          "Dahili güç kaynağı",
          "Li-Ion, 2.250 mAh, 8 Wh"
        ],
        [
          "Boyutlar / Ağırlık",
          "82 x 169 x 44 mm / yaklaşık 400g (probsuz)"
        ]
      ]
    }
  ],
  "listPrice": 83985,
  "salePrice": 49500,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/690109-deltasmart-set.png",
    "/images/products/690109-deltasmart-device.png"
  ],
  "primaryImage": "/images/products/690109-deltasmart-set.png",
  "discrepancyNote": "Kaynak DOCX tablosunun 6. satırında 'Diferansiyel basınç' parametresinin birim ve aralığı '-40 ... +1.200 °C' ve doğruluk '± 2 °C veya %0,5' olarak yazılmıştır (sıcaklık birimleri basınç satırında yer almaktadır). Tablonun 9. satırında ise 'DiferansiyelBasınç' ayrıca '± 200 hPa (mbar)' olarak verilmiştir."
},
  {
  "id": "420145",
  "code": "420145",
  "name": "MRU OPTIMA COA Profesyonel Baca Gazı Analiz Cihazı Seti – Yazıcılı, Çantalı, Bluetoothlu",
  "shortTitle": "OPTIMA COA Profesyonel Baca Gazı Analiz Seti",
  "brand": "MRU GmbH",
  "model": "MRU OPTIMA COA Set",
  "category": "Baca Gazı Analiz Cihazları",
  "productType": "set",
  "sensorPurpose": null,
  "requiresSensor": false,
  "requiresSensorNotice": null,
  "compatibleProductCodes": [],
  "applications": [
    "yanma-analizi"
  ],
  "shortDescription": "4\" geniş renkli ekran, 4-5 yıl ömürlü Long-Life sensörler, CO sensör koruma pompası ve tam aksesuar seti ile endüstriyel kazan servisleri için tasarlanmış yüksek segment analiz çözümü.",
  "description": "MRU OPTIMA COA, modern tasarımı ve üstün donanımıyla profesyonel baca gazı analizinde çıtayı yükseltmektedir. 4 inç büyüklüğündeki yüksek çözünürlüklü renkli ekranı, tüm verilerin aynı anda kolayca okunmasını sağlar. Cihaz, CO sensörünü aşırı yüklenmelere karşı koruyan otomatik bir tahliye pompasına sahiptir. 4 yıl garanti süresi ve PTFE (Teflon) kaplamalı yıkanabilir filtre yapısı ile işletme maliyetlerini minimize eder. Bluetooth bağlantısı sayesinde iOS ve Android cihazlarla tam uyumlu çalışarak saha raporlamasını dijitalleştirir.",
  "features": [
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
  ],
  "boxContent": [
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
  ],
  "specTables": [
    {
      "headers": [
        "Parametre",
        "Ölçüm Aralığı",
        "Çözünürlük"
      ],
      "rows": [
        [
          "O2 (Long-Life)",
          "0 - 21,00 % 4-5 yıl ömürlü sensör",
          "0,01 %"
        ],
        [
          "CO (H₂ Kompanzasyonlu)",
          "0 - 10.000 ppm / 20.000 ppm aşırı yük korumalı",
          "1 ppm"
        ],
        [
          "Baca Gazı Sıcaklığı",
          "0 - 650 °C Paslanmaz çelik prob ile",
          "0,1 °C"
        ],
        [
          "Ortam Sıcaklığı",
          "0 - 100 °C",
          "0,1 °C"
        ],
        [
          "Baca Çekişi / Fark Basınç",
          "-100 mbar ... +100 mbar",
          "0,01 mbar"
        ],
        [
          "Fark Sıcaklık",
          "2 Kanal K-Type Thermocouple Girişİ",
          "0,1 °C"
        ]
      ]
    },
    {
      "headers": [
        "Parametre",
        "Detay"
      ],
      "rows": [
        [
          "CO2",
          "Yakıt türüne göre otomatik hesaplanır"
        ],
        [
          "Hava Fazlalık Katsayısı",
          "Lambda (λ) değeri"
        ],
        [
          "Yanma Verimliliği",
          "Eta (η) hesaplaması"
        ],
        [
          "Isıl Kayıp",
          "qA değeri"
        ],
        [
          "Emisyon Dönüşümleri",
          "mg/m3, mg/kWh ve Ref O2 normalizasyonu"
        ],
        [
          "NOx Hesabı",
          "NO sensörü eklendiğinde NO(x) hesaplamalı"
        ]
      ]
    },
    {
      "headers": [
        "Özellik",
        "Teknik Detay"
      ],
      "rows": [
        [
          "Ekran",
          "4 inç (10 cm) Renkli TFT, Arka Aydınlatmalı"
        ],
        [
          "Sensör Koruma",
          "Otomatik CO sensör koruma pompası (Purge)"
        ],
        [
          "Hafıza",
          "20.000 dahili ölçüm kaydı ve SD kart desteği"
        ],
        [
          "Veri Çıkışı",
          "CSV (Excel) formatında dışarı aktarma"
        ],
        [
          "Batarya",
          "Li-Ion batarya ile 10 saate kadar çalışma"
        ],
        [
          "Şarj",
          "USB bağlantısı (PC, Araç Çakmaklığı veya 220V)"
        ],
        [
          "Yazılım",
          "MRU4win (PC) ve MRU4U (Mobil) desteği"
        ],
        [
          "Garanti",
          "4 Yıl (Cihaz ve Sensörler Dahil)"
        ]
      ]
    }
  ],
  "listPrice": 147620,
  "salePrice": 72500,
  "currency": "TL",
  "vatIncluded": false,
  "images": [
    "/images/products/420145-optima-coa-1.jpg",
    "/images/products/420145-optima-coa-2.jpg"
  ],
  "primaryImage": "/images/products/420145-optima-coa-1.jpg",
  "discrepancyNote": "Set içeriği DOCX dosyasında 'Set İçeriği ve Öne Çıkan Özellikler' başlığı altında birleşik olarak verilmiştir."
},
];

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
