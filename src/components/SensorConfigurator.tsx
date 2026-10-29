import React from 'react';
import { Product, PRODUCTS, SENSOR_PURPOSES, SensorPurpose } from '../data/products';
import { Check, Plus, Trash2, ShoppingBag, Info, Flame, Snowflake, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { getProductUrl } from '../utils/navigation';

interface SensorConfiguratorProps {
  baseProduct: Product;
  deviceQuantity: number;
  onUpdateDeviceQuantity: (qty: number) => void;
  selectedSensorCodes: string[];
  sensorQuantities: Record<string, number>;
  onToggleSensor: (sensorCode: string) => void;
  onUpdateSensorQuantity: (sensorCode: string, qty: number) => void;
  onRemoveSensor: (sensorCode: string) => void;
  onAddBundleToCart: (items: { product: Product; quantity: number }[]) => void;
}

const PURPOSE_ICONS: Record<SensorPurpose, React.ComponentType<{ className?: string }>> = {
  'yanici-gaz': Flame,
  'sogutucu-gaz': Snowflake,
  'ortam-gazi': Wind,
  'sicaklik-iklim': Thermometer,
  'baca-geri-tepmesi': AlertTriangle,
};

export const SensorConfigurator: React.FC<SensorConfiguratorProps> = ({
  baseProduct,
  deviceQuantity,
  onUpdateDeviceQuantity,
  selectedSensorCodes,
  sensorQuantities,
  onToggleSensor,
  onUpdateSensorQuantity,
  onRemoveSensor,
  onAddBundleToCart,
}) => {
  const formatPrice = (val: number | null) => {
    if (val === null) return '0';
    return new Intl.NumberFormat('tr-TR').format(val);
  };

  // Filter only sensors that are validated by baseProduct.compatibleProductCodes and have a valid price
  const compatibleCodes = baseProduct.compatibleProductCodes || [];
  const selectedSensors = PRODUCTS.filter(
    (p) => selectedSensorCodes.includes(p.code) && compatibleCodes.includes(p.code) && p.salePrice !== null
  );

  // Math: base price * deviceQuantity + each sensor * sensorQuantity
  const basePriceUnit = baseProduct.salePrice || 0;
  const basePriceTotal = basePriceUnit * deviceQuantity;
  const sensorsPriceTotal = selectedSensors.reduce((sum, s) => {
    const qty = sensorQuantities[s.code] || 1;
    return sum + (s.salePrice || 0) * qty;
  }, 0);
  const bundleTotalPrice = basePriceTotal + sensorsPriceTotal;

  // Total items in bundle
  const totalSensorItemsCount = selectedSensors.reduce((sum, s) => sum + (sensorQuantities[s.code] || 1), 0);
  const totalBundleItemsCount = deviceQuantity + totalSensorItemsCount;

  const handleAddBundle = () => {
    const items: { product: Product; quantity: number }[] = [
      { product: baseProduct, quantity: deviceQuantity },
      ...selectedSensors.map((s) => ({
        product: s,
        quantity: sensorQuantities[s.code] || 1,
      })),
    ];
    onAddBundleToCart(items);
  };

  return (
    <div id="sensor-secimi" className="mt-12 pt-10 border-t border-[#E2E7E8]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E2E7E8]">
        <div>
          <span className="text-[12px] font-[700] text-[#C82B35] uppercase tracking-wider">
            Modüler Tak-Kullan Ekosistemi
          </span>
          <h2 className="text-[28px] font-[700] text-[#16242B] tracking-tight mt-1">
            Uyumlu Sensörünü Seç — Cihazını Tamamla
          </h2>
          <p className="text-[15px] text-[#4A5568] mt-1.5 max-w-2xl leading-relaxed">
            {baseProduct.model} gövdesi akıllı sensör mimarisine sahiptir. İhtiyacınız olan sensörleri ve adetlerini belirleyerek tek cihazda çok amaçlı ölçüm yapabilirsiniz. Sensörler sahada tak-çıkar ile saniyeler içinde değiştirilir.
          </p>
        </div>
      </div>

      {/* Main Grid: Sensors on Left, Sticky Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 items-start">
        
        {/* Left Column: 5 Groups */}
        <div className="lg:col-span-8 space-y-10">
          
          {SENSOR_PURPOSES.map((group) => {
            const GroupIcon = PURPOSE_ICONS[group.key];
            // Only show sensors matching this sensorPurpose AND verified in baseProduct.compatibleProductCodes
            const groupSensors = PRODUCTS.filter(
              (p) => p.sensorPurpose === group.key && compatibleCodes.includes(p.code)
            );

            if (groupSensors.length === 0) return null;

            return (
              <div key={group.key} className="space-y-4">
                
                {/* Group Heading */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#E2E7E8]">
                  <div className="w-7 h-7 rounded-[4px] bg-[#F3F5F5] flex items-center justify-center text-[#16242B]">
                    <GroupIcon className="w-4 h-4 text-[#C82B35]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-[700] text-[#16242B]">
                      {group.label}
                    </h3>
                    <p className="text-[13px] text-[#4A5568]">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* HC Models Comparison Explanatory Box */}
                {group.key === 'yanici-gaz' && (
                  <div className="p-4 bg-[#FBF0F0] border border-[#E2E7E8] rounded-[8px] text-[13px] leading-relaxed">
                    <div className="flex items-center gap-2 text-[#C82B35] font-[700] text-[13px] mb-2">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      <span>HC Serisi Yanıcı Gaz Sensörleri Arasındaki Farklar:</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[#16242B]">
                      <li className="bg-white p-2.5 rounded-[6px] border border-[#E2E7E8]">
                        <strong className="block text-[#16242B] font-[700]">HC400 (Doğal Gaz)</strong>
                        <span className="text-[#4A5568] text-[12px] block mt-0.5">
                          Metan (CH₄) kaçak tespiti için sensör başlığı.
                        </span>
                      </li>
                      <li className="bg-white p-2.5 rounded-[6px] border border-[#E2E7E8]">
                        <strong className="block text-[#16242B] font-[700]">HC401 (Metan & Propan)</strong>
                        <span className="text-[#4A5568] text-[12px] block mt-0.5">
                          Hem <strong>Metan</strong> hem de <strong>Propan (LPG)</strong> kaçaklarını kalibreli ölçer.
                        </span>
                      </li>
                      <li className="bg-white p-2.5 rounded-[6px] border border-[#E2E7E8]">
                        <strong className="block text-[#16242B] font-[700]">HC402 (Metan + Propan + Hidrojen)</strong>
                        <span className="text-[#4A5568] text-[12px] block mt-0.5">
                          Metan (CH₄), Propan (C₃H₈) ve Hidrojen (H₂) kaçak tespiti için çoklu gaz başlığı.
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Sensors Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupSensors.map((sensor) => {
                    const isSelected = selectedSensorCodes.includes(sensor.code);
                    const currentQty = sensorQuantities[sensor.code] || 1;
                    const sensorUrl = getProductUrl(sensor);

                    return (
                      <div
                        key={sensor.code}
                        data-sensor-code={sensor.code}
                        className={`p-4 rounded-[8px] border transition-all duration-150 flex flex-col justify-between h-full ${
                          isSelected
                            ? 'bg-white border-[#C82B35] shadow-sm ring-1 ring-[#C82B35]'
                            : 'bg-white border-[#E2E7E8] hover:border-[#16242B]'
                        }`}
                      >
                        <div className="flex-1 flex flex-col">
                          {/* Image Box: White background with clean product link */}
                          <div className="relative w-full h-[150px] bg-white rounded-[6px] border border-[#E2E7E8] overflow-hidden group">
                            <a
                              href={sensorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${sensor.shortTitle} - Detayları yeni sekmede incele`}
                              className="w-full h-full flex items-center justify-center p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] rounded-[5px]"
                            >
                              <img
                                src={sensor.primaryImage}
                                alt={sensor.shortTitle}
                                className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-150 motion-reduce:transform-none"
                                loading="eager"
                              />
                            </a>

                            {/* Real Checkbox Button Semantics (Independent sibling, NOT nested in <a>) */}
                            <button
                              type="button"
                              role="checkbox"
                              data-sensor-toggle={sensor.code}
                              aria-checked={isSelected}
                              aria-label={`${sensor.model} seç`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSensor(sensor.code);
                              }}
                              className={`absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-[4px] border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] ${
                                isSelected
                                  ? 'bg-[#C82B35] border-[#C82B35] text-white'
                                  : 'bg-white border-[#A0ADB5] text-transparent hover:border-[#16242B]'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Info */}
                          <div className="mt-3 flex-1 flex flex-col">
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#4A5568]">
                              <span>Kod: {sensor.code}</span>
                              <span className="font-[600] text-[#16242B]">{sensor.model}</span>
                            </div>

                            <h4 className="text-[15px] font-[700] text-[#16242B] mt-1 leading-snug min-h-[42px] line-clamp-2">
                              <a
                                href={sensorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${sensor.shortTitle} - Detayları yeni sekmede incele`}
                                className="hover:text-[#C82B35] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] rounded-[2px]"
                              >
                                {sensor.shortTitle}
                              </a>
                            </h4>

                            <p className="text-[12px] text-[#4A5568] mt-1 line-clamp-2 min-h-[36px] leading-relaxed">
                              {sensor.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Price & Selection / Quantity Controls */}
                        <div className="mt-4 pt-3 border-t border-[#E2E7E8]">
                          <div className="flex items-baseline justify-between mb-2.5">
                            <span className="text-[16px] font-[750] text-[#16242B] font-mono leading-none">
                              {formatPrice(sensor.salePrice)} TL
                            </span>
                            <span className="text-[11px] text-[#4A5568]">+ KDV</span>
                          </div>

                          {/* Equal-width Two Buttons Row: 8px gap, 38px height */}
                          <div className="grid grid-cols-2 gap-2 h-[38px]">
                            {/* Sol: "Sensör ekle" (unselected) / "Seçimi kaldır" (selected) */}
                            {isSelected ? (
                              <button
                                type="button"
                                onClick={() => onToggleSensor(sensor.code)}
                                className="w-full h-[38px] px-2 rounded-[6px] bg-[#FBF0F0] hover:bg-[#C82B35] text-[#C82B35] hover:text-white border border-[#C82B35] text-[13px] font-[600] flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C82B35] text-center"
                                aria-label={`${sensor.model} seçimini kaldır`}
                              >
                                <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">Seçimi kaldır</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onToggleSensor(sensor.code)}
                                className="w-full h-[38px] px-2 rounded-[6px] bg-[#16242B] hover:bg-[#C82B35] text-white text-[13px] font-[600] flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] text-center"
                              >
                                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">Sensör ekle</span>
                              </button>
                            )}

                            {/* Sağ: "Ürünü incele" (white background, distinct dark border, dark text, real link) */}
                            <a
                              href={sensorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${sensor.shortTitle} - Ürünü yeni sekmede incele`}
                              className="w-full h-[38px] px-2 rounded-[6px] bg-white border border-[#16242B] text-[#16242B] hover:bg-[#F3F5F5] text-[13px] font-[600] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] text-center"
                            >
                              <span className="truncate">Ürünü incele</span>
                            </a>
                          </div>

                          {/* Dedicated Quantity Controls Row (Underneath the two buttons) */}
                          {/* Height is reserved so that cards in the same row maintain identical button vertical alignment whether selected or not */}
                          <div className="mt-2.5 h-[36px] flex items-center">
                            {isSelected ? (
                              <div className="w-full h-full flex items-center justify-between bg-[#F3F5F5] border border-[#E2E7E8] rounded-[6px] px-3 text-xs animate-fadeIn">
                                <span className="text-[12px] font-[600] text-[#16242B]">
                                  Sensör Adedi:
                                </span>
                                <div className="flex items-center border border-[#E2E7E8] rounded-[4px] bg-white text-xs">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateSensorQuantity(sensor.code, Math.max(1, currentQty - 1));
                                    }}
                                    className="w-7 h-7 hover:bg-[#F3F5F5] text-[#16242B] font-[700] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16242B]"
                                    aria-label="Sensör adedini azalt"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-[700] text-[#16242B] border-x border-[#E2E7E8] font-mono">
                                    {currentQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateSensorQuantity(sensor.code, currentQty + 1);
                                    }}
                                    className="w-7 h-7 hover:bg-[#F3F5F5] text-[#16242B] font-[700] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16242B]"
                                    aria-label="Sensör adedini artır"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </div>

        {/* Right Column: Sticky Configuration Summary */}
        <div className="lg:col-span-4 sticky top-28 bg-[#F3F5F5] border border-[#E2E7E8] rounded-[10px] p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E7E8]">
            <ShoppingBag className="w-5 h-5 text-[#C82B35]" />
            <h3 className="text-[17px] font-[700] text-[#16242B]">
              Paket Konfigürasyon Özeti
            </h3>
          </div>

          {/* Base Device Line with Quantity Selector */}
          <div className="mt-4 p-3 bg-white rounded-[6px] border border-[#E2E7E8]">
            <span className="text-[11px] font-[700] text-[#C82B35] uppercase tracking-wider block">
              Ana Cihaz (Baz Ünite)
            </span>
            <div className="flex items-center justify-between mt-1">
              <strong className="text-[14px] font-[700] text-[#16242B]">
                {baseProduct.model}
              </strong>
              <span className="text-[14px] font-mono font-[700] text-[#16242B]">
                {formatPrice(basePriceUnit)} TL
              </span>
            </div>
            
            {/* Base Device Quantity Controls */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E2E7E8]">
              <span className="text-[12px] text-[#4A5568]">Cihaz Adedi:</span>
              <div className="flex items-center border border-[#E2E7E8] rounded-[4px] bg-[#F3F5F5] text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateDeviceQuantity(Math.max(1, deviceQuantity - 1))}
                  className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors"
                  aria-label="Cihaz adedini azalt"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 font-[700] text-[#16242B] border-x border-[#E2E7E8] font-mono bg-white">
                  {deviceQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateDeviceQuantity(deviceQuantity + 1)}
                  className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors"
                  aria-label="Cihaz adedini artır"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Selected Sensors List */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[12px] font-[600] text-[#4A5568]">
              <span>Seçilen Sensörler ({selectedSensors.length})</span>
              {selectedSensors.length > 0 && (
                <span className="text-[11px] text-[#C82B35]">Bağımsız Değiştirilebilir</span>
              )}
            </div>

            {selectedSensors.length === 0 ? (
              <div className="p-4 bg-white/70 border border-dashed border-[#E2E7E8] rounded-[6px] text-center text-[12px] text-[#4A5568]">
                Henüz sensör seçilmedi. Soldaki listeden cihazınızla kullanmak istediğiniz sensörleri işaretleyin.
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {selectedSensors.map((sensor) => {
                  const sQty = sensorQuantities[sensor.code] || 1;
                  const lineTotal = (sensor.salePrice || 0) * sQty;

                  return (
                    <div
                      key={sensor.code}
                      className="p-2.5 bg-white rounded-[6px] border border-[#E2E7E8] flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-[13px] font-[650] text-[#16242B] truncate block">
                            {sensor.model}
                          </span>
                          <span className="text-[11px] text-[#4A5568] truncate block">
                            {sensor.shortTitle}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveSensor(sensor.code)}
                          className="p-1 text-[#4A5568] hover:text-[#C82B35] transition-colors"
                          title="Sensörü kaldır"
                          aria-label="Sensörü kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#E2E7E8] text-xs">
                        <div className="flex items-center border border-[#E2E7E8] rounded-[4px] bg-[#F3F5F5]">
                          <button
                            type="button"
                            onClick={() => onUpdateSensorQuantity(sensor.code, Math.max(1, sQty - 1))}
                            className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors"
                            aria-label="Sensör adedini azalt"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-[700] text-[#16242B] border-x border-[#E2E7E8] font-mono bg-white">
                            {sQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateSensorQuantity(sensor.code, sQty + 1)}
                            className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors"
                            aria-label="Sensör adedini artır"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono font-[700] text-[13px] text-[#16242B]">
                          {formatPrice(lineTotal)} TL
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Calculations */}
          <div className="mt-6 pt-4 border-t border-[#E2E7E8] space-y-2">
            <div className="flex justify-between text-[13px] text-[#4A5568]">
              <span>Ana Cihaz ({deviceQuantity} adet):</span>
              <span className="font-mono font-[600] text-[#16242B]">{formatPrice(basePriceTotal)} TL</span>
            </div>

            <div className="flex justify-between text-[13px] text-[#4A5568]">
              <span>Sensörler ({totalSensorItemsCount} adet{selectedSensors.length > 1 ? ` · ${selectedSensors.length} farklı ürün` : ''}):</span>
              <span className="font-mono font-[600] text-[#16242B]">{formatPrice(sensorsPriceTotal)} TL</span>
            </div>

            <div className="pt-2 border-t border-[#E2E7E8] flex justify-between items-baseline">
              <span className="text-[14px] font-[700] text-[#16242B]">
                Toplam (KDV Hariç):
              </span>
              <div className="text-right">
                <span className="text-[24px] font-[800] text-[#16242B] font-mono tracking-tight">
                  {formatPrice(bundleTotalPrice)} TL
                </span>
                <span className="text-[11px] text-[#4A5568] block">+ KDV</span>
              </div>
            </div>
          </div>

          {/* Add Bundle Action */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddBundle}
              className="w-full h-[48px] rounded-[6px] bg-[#C82B35] hover:bg-[#B3232C] text-white text-[15px] font-[700] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {selectedSensors.length > 0
                  ? `Paketi Sepete Ekle (${totalBundleItemsCount} adet · ${1 + selectedSensors.length} farklı ürün)`
                  : `Yalnızca Cihazı Ekle (${deviceQuantity} Adet)`}
              </span>
            </button>
            <p className="text-[11px] text-[#4A5568] text-center mt-2 leading-tight">
              Tüm ürünler sepete ayrı satırlar olarak eklenir ve adetleri bağımsız yönetilebilir.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
