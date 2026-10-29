# Ürün kaynağı denetimi

Tarih: 29 Ekim 2026

## Yöntem

Kök klasördeki kaynak DOCX'in word/document.xml içeriği bağımsız ve salt okunur biçimde çıkarıldı. Ürün kodlarına göre 17 blok ve tablolar ayrıldı. Mevcut src/data/products.ts PRODUCTS kayıtlarıyla karşılaştırıldı. Yalnızca boşluk, Unicode normalizasyonu ve LaTeX kimyasal gösterim dönüşümleri karşılaştırmada normalleştirildi. parse_docx.py ve generate_ts_data.py okunarak aktarım mantığı incelendi; yeniden çalıştırılmadı. Bu denetimde ürün veya uygulama dosyası değiştirilmedi.

## Sonuçlar

- Tam ürün adı: 17/17 eşleşiyor.
- Kısa açıklama: 17/17 eşleşiyor.
- Uzun açıklama: 17/17 eşleşiyor.
- Teknik tablo başlıkları ve hücreleri: 17/17 eşleşiyor.
- Liste ve satış fiyatları: 17/17 eşleşiyor. 912212 fiyatı Word'de yok; katalogda null.
- 9 sensörün tamamında 400GD ve 500GD uyumluluğu Word'de açıkça belirtiliyor. Kod bu ilişkileri tüm sensörlere ve iki ana cihaza karşılıklı atamış.
- Mevcut features ve boxContent maddeleri kaynak bloklarda metin olarak bulundu; OPTIMA COA boxContent maddeleri aşağıdaki istisnadır. Bu kontrol eksiksiz alan ayrıştırması/semantik doğruluk garantisi değildir.

## Birebir aktarım olmayanlar

- shortTitle, model etiketleri, sensör amaçları, kategori/uygulama eşleştirmeleri ve filtre etiketleri sonradan yapılandırıldı/yazıldı.
- Hero, ürün aileleri, konfigüratör karşılaştırmaları, tanıtım ve navigasyon metinleri Word'den aynen alınmadı; kaynak özellikleri yorumlayan kısa metinler yazıldı.
- 420145 OPTIMA COA kutu içeriği generate_ts_data.py içinde el ile oluşturulmuş bir listedir. Word'deki birleşik özellik/set içeriği bölümünden özetlenmiştir. Örneğin dahili Bluetooth'un ayrı bir modül/teslimat parçası olarak listelenmesi, özellik ile kutu içeriği ayrımını bulanıklaştırır. Bu listeyi birebir kaynak aktarımı olarak nitelemek doğru değildir.
- APPLICATIONS tanıtım metnindeki “yanma verimliliği sertifikasyonu” gibi ifadeler doğrudan kaynak alıntısı değildir; kaynak dışı teknik iddia olarak ayrıca temizlenmeli veya dayanağı işaretlenmelidir. Tek başına kullanılmayan veri metni olması bu ifadeyi kaynaklı yapmaz.
- Mevcut doğrudan ürün verilerinde alternatif web kaynaklarından eklenmiş sayısal teknik özellik/fiyat bu karşılaştırmada bulunmadı. Bu sonuç tüm geliştirme geçmişinde hiç dış kaynak kullanılmadığının kanıtı değildir.
- Başlangıç firma/sektör araştırması, firma iletişimi ve tasarım referansları için web kaynakları kullanılmıştır. Bunlar tüm sitenin yalnızca Word'den geldiği iddiasını geçersiz kılar.
- %20 KDV oranı ve WhatsApp hattı kullanıcı tarafından ayrıca teyit edilmiştir; Word'den alınmamıştır.

## Sonuç

Çekirdek ürün verileri Word ile eşleşmektedir. Ancak tüm site içeriğinin yorumsuz ve yalnızca Word'den aktarılmış olduğu söylenemez. Pazarlama metinleri, sınıflandırmalar ve yeniden yazılan set içeriği için kaynak-sadakat temizliği önerilir. Bu temizlik henüz uygulanmamıştır.
