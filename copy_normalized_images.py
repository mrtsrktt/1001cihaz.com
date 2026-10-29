import os
import shutil

src_dir = 'urun-gorselleri'
dest_dir = os.path.join('public', 'images', 'products')

mapping = {
    '11138 HC400 NET.jpeg': '11138-hc400.jpg',
    '11190 RF400.jpeg': '11190-rf400.jpg',
    '11191 RM400.jpeg': '11191-rm400.jpg',
    '11591 HC401.jpeg': '11591-hc401.jpg',
    '11733 HC402.jpeg': '11733-hc402.jpg',
    '11922 HM400.jpeg': '11922-hm400.jpg',
    '12121 IR400.jpeg': '12121-ir400.jpg',
    '12130 CO400.jpeg': '12130-co400.jpg',
    '12130 CO400 -2.jpeg': '12130-co400-alt.jpg',
    '12623 CD400.jpeg': '12623-cd400.jpg',
    '420145 OPTIMA COA 1.jpg': '420145-optima-coa-1.jpg',
    '420145 OPTIMA COA 2.jpg': '420145-optima-coa-2.jpg',
    '681000 - 682000 Sensörler.png': '681000-682000-sensor-group.png',
    '681000 400GD 2. FOTO.jpg': '681000-400gd-back.jpg',
    '681000 400GD SENSORLERI.jpeg': '681000-400gd-sensors.jpg',
    '681000 400GD.png': '681000-400gd.png',
    '682000 500GD.png': '682000-500gd.png',
    '690109 DELTAsmart 1.png': '690109-deltasmart-set.png',
    '690109 DELTAsmart 2.png': '690109-deltasmart-device.png',
    '912200 - 912202 - 912206 - 912212 DM9600.png': 'dm9600-series.png'
}

for original, normalized in mapping.items():
    src = os.path.join(src_dir, original)
    if os.path.exists(src):
        dst = os.path.join(dest_dir, normalized)
        shutil.copy2(src, dst)
        print(f'Copied: {original} -> {normalized}')
    else:
        print(f'Not found: {original}')
