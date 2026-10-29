# AG talimatı — Hero slider ve yumuşak etkileşimler

29 Ekim 2026. Önce PROJE_NOTLARI.md dosyasını oku. Bu talimat, önceki statik hero kararının yerine geçer. Yalnızca masaüstü çalışılacak. Kodlama AG'nin sorumluluğundadır.

## Kapsam

Mevcut üç parçalı hero yerine tek geniş dört slaytlı vitrin oluştur. Sağdaki iki küçük panel kalksın. Alt değer şeridi korunsun. Yeni sayfa, ödeme veya ürün verisi değişikliği yapma. Hero hiçbir slaytta fiyat içermesin.

## Tasarım ve kompozisyon

- 1280px içerik standardını ve 1440px ekranda 80px yan boşluğu koru.
- Hero üstünde 24px boşluk; slayt sahnesi 480px yükseklik, 12px köşe, overflow hidden.
- Dört üretilmiş arka plan output/hero-assets-v1 klasöründe hazır. Bunları public/images/hero altına kopyala ve optimize edilmiş WebP sürümlerini oluştur. Kaynak PNG'leri koru.
- Her slaytta eşleşen arka plan cover kullanılsın. Soldaki koyu sakin alan metin içindir.
- Solda 56px iç boşlukla yaklaşık 530px metin alanı. Sağda gerçek MRU ürün görseli, görünür cihaz yüksekliği yaklaşık 340–380px.
- Gerçek fotoğrafları urun-gorselleri veya mevcut normalize ürün görsellerinden seç. Cihazı, ekranını, markasını veya donanımını AI ile yeniden çizme. OPTIMA'nın beyaz zeminli fotoğrafını koyu sahneye beyaz dikdörtgen olarak koyma: gerçek ürünü koruyan temiz bir cutout hazırla; araç yoksa bunu raporla.
- Arka planlar temsili uygulama ortamlarıdır; MRU fabrikası/müşteri tesisi diye etiketleme.
- Ürünler görsele gömülmesin. Arka plan, gerçek cihaz PNG/cutout ve HTML metin ayrı katmanlar olsun.
- Aynı anda tek ürün hikâyesi; görsel kalabalığı, yapay neon veya uçuşan parçacık kullanma.

## Slaytların kesin metinleri

1. DELTAsmart — hero-deltasmart.png; ürün 690109.
Üst etiket: BACA GAZI ANALİZİ
Başlık: Yanmayı ölçün.\nVerimliliği değerlendirin.
Açıklama: DELTAsmart ile O₂, CO, sıcaklık ve basınç ölçümlerini tek cihazda inceleyin.
Buton: DELTAsmart’ı incele
Bağlantı: mevcut DELTAsmart ürün URL'si.

2. OPTIMA COA — hero-optima.png; ürün 420145.
Üst etiket: PROFESYONEL ANALİZ SETİ
Başlık: Kapsamlı analiz.\nSahada net sonuçlar.
Açıklama: Geniş ekranı ve CO sensör koruma sistemiyle OPTIMA COA’yı keşfedin.
Buton: OPTIMA COA’yı incele
Bağlantı: mevcut OPTIMA COA ürün URL'si.

3. 400GD/500GD sistemi — hero-400gd.png; ana ürün 681000.
Üst etiket: MODÜLER GAZ KAÇAK TESPİTİ
Başlık: Cihazınızı seçin.\nÖlçümünüzü genişletin.
Açıklama: 400GD ve pompalı 500GD’yi ihtiyacınıza uygun değiştirilebilir sensörlerle tamamlayın.
Buton: Cihazları keşfet
Bağlantı: /kategori/gaz-kacak-dedektorleri
Kısa not: Sensörler ayrıca seçilir.
Görsel: 400GD ana odak, 500GD daha küçük ikinci ürün olabilir; set izlenimi yaratma.

4. DM9600 — hero-dm9600.png; ürün 912200.
Üst etiket: HASSAS BASINÇ ÖLÇÜMÜ
Başlık: Doğru aralık.\nHassas basınç ölçümü.
Açıklama: Basınç, fark basıncı ve sıcaklık ölçümü için DM9600 modellerini karşılaştırın.
Buton: DM9600 modellerini incele
Bağlantı: /kategori/dijital-manometreler

Tipografi:
Üst etiket 12px/700, 1.6px harf aralığı; düz metin, rozet kutusu yok.
Ana başlık 48px/54px, 700 ağırlık, beyaz; doğal iki satır. 1280px'de gerekirse 44px/50px.
Açıklama 16px/26px, yeterli kontrast, en fazla 3 satır.
Ana buton 48px yükseklik, mevcut marka kırmızısı, beyaz metin.
Diğer sayfa bölüm başlıkları 32px/700; abartılı büyük harf veya yeni süsler ekleme.

## Slider davranışı

- Her slayt tam görünür olduktan sonra 5000ms bekle; ardından sonraki slayta geç.
- Yatay geçiş: 550ms translateX, ease cubic-bezier(0.22,1,0.36,1). Zıplama, yatay sayfa taşması ve yükseklik değişimi olmasın.
- Fare hero üzerindeyken, klavye odağı içindeyken, sekme arka plandayken veya hero ekran dışındayken otomatik geçiş dursun.
- Önceki/sonraki okları ve görünür duraklat/oynat kontrolü bulunmalı.
- Hero altında dört eşit ürün gezinme düğmesi: DELTAsmart / OPTIMA COA / 400GD & 500GD / DM9600. Aktif düğmede ince kırmızı alt çizgi ve 5 saniyelik ilerleme göstergesi.
- Gezinme düğmeleri gerçek button; slider carousel semantiği ve aktif slayt bilgisi olsun. Otomatik geçişler ekran okuyucuya sürekli anons edilmesin.
- Görünmeyen slaytların linkleri Tab sırasına girmesin.
- Kullanıcı duraklatmışsa hover kalkınca otomatik yeniden başlatma.
- prefers-reduced-motion durumunda otomatik oynatma kapalı, geçiş anlık olsun; manuel gezinme çalışsın.
- İlk görsel öncelikli yüklensin; diğerlerini geçiş öncesi hazırla. Boş slayt veya yüklenirken yer kayması olmasın.

## Premium soft hover

Hero:
- CTA: 180ms'de 2px yukarı hareket, kontrollü hafif gölge; ok 3px sağa.
- Ürün görseli: hover'da en fazla scale(1.02), 450ms. Slider geçiş transform'u ile aynı DOM katmanına uygulama.
- Ok ve gezinme düğmeleri: 180ms renk/zemin geçişi.
- Fareyi takip eden tilt/parallax ve sürekli sallanma kullanma.

Ortak ürün kartları:
- Hover: translateY(-4px), 220ms ease-out; hafif gölge 0 12px 28px rgba(18,33,41,.09).
- Fotoğraf scale(1.03), 350ms; kart boyutu değişmesin.
- Buton zemini/koyu kenarlık yumuşak değişsin; ok 3px sağa.
- Aynı vurgunun uygun karşılığı focus-visible'da da olsun. Azaltılmış hareket tercihinde transform/animasyon kaldır.
- Sensör konfigüratöründe yeni yan yana buton düzenini, seçim/adetleri ve bağımsız inceleme davranışını bozma.

## Kontrol ve teslim

- 4 slaytın her birini 1440px ekran görüntüsüyle paylaş.
- En az iki geçiş ve hero/kart hover'larını gösteren kısa ekran kaydı paylaş.
- 5 saniyelik süre, hover/focus durması, manuel pause'un korunması, manuel oklar, doğru ürün linkleri, görünmez slayt Tab erişimi ve reduced-motion davranışını test et.
- 1280 ve 1440px'de taşma/çakışma kontrol et.
- Ortak kartların ana sayfa/kategori ve sensör seçimi davranışlarını koruduğunu doğrula.
- Gerçek assertion sonuçları ve build raporu ver. Görsel üretmek için yeni AI çağrısı yapma; hazırlanan varlıkları kullan.
- Bu kapsam bitince dur.

