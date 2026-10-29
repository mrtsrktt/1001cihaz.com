import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import re
import glob
import zipfile
import xml.etree.ElementTree as ET

# Load docx XML
docx_files = glob.glob('*.docx')
print('Found docx:', docx_files)

with zipfile.ZipFile(docx_files[0]) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)

w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def get_text(element):
    return ''.join(node.text for node in element.iter(f'{{{w_ns}}}t') if node.text)

body = tree.find(f'{{{w_ns}}}body')
elements = []
for child in body:
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        txt = get_text(child).strip()
        if txt:
            elements.append(('p', txt))
    elif tag == 'tbl':
        tbl_data = []
        for row in child.iter(f'{{{w_ns}}}tr'):
            row_data = []
            for cell in row.iter(f'{{{w_ns}}}tc'):
                row_data.append(get_text(cell).strip())
            tbl_data.append(row_data)
        elements.append(('tbl', tbl_data))

print(f'Total elements: {len(elements)}')

# Find all product starts
product_starts = []
for idx, (el_type, content) in enumerate(elements):
    if el_type == 'p' and re.search(r'Ürün Kodu:\s*([0-9A-Za-z]+)', content, re.IGNORECASE):
        product_starts.append(idx)

print('Product start indices:', product_starts)
print('Count of products:', len(product_starts))

products = []
for i, start_idx in enumerate(product_starts):
    end_idx = product_starts[i+1] if i + 1 < len(product_starts) else len(elements)
    product_elements = elements[start_idx:end_idx]
    
    code = ''
    name = ''
    short_desc = ''
    detail_desc = ''
    features = []
    box_content = []
    spec_tables = []
    list_price = None
    sale_price = None
    
    mode = 'general' # general, features, box, specs, price
    
    for el_type, content in product_elements:
        if el_type == 'tbl':
            spec_tables.append(content)
            continue
            
        txt = content.strip()
        
        # Check code
        code_match = re.search(r'Ürün Kodu:\s*([0-9A-Za-z]+)', txt, re.IGNORECASE)
        if code_match:
            code = code_match.group(1).strip()
            continue
            
        # Check name
        name_match = re.search(r'Ürün Adı:\s*(.+)', txt, re.IGNORECASE)
        if name_match:
            name = name_match.group(1).strip()
            continue
            
        # Check short desc
        short_match = re.search(r'Kısa Açıklama:\s*(.+)', txt, re.IGNORECASE)
        if short_match:
            short_desc = short_match.group(1).strip()
            continue
            
        # Check detail desc
        detail_match = re.search(r'Ürün Detayı:\s*(.+)', txt, re.IGNORECASE)
        if detail_match:
            detail_desc = detail_match.group(1).strip()
            continue
            
        # Section triggers
        if any(h in txt for h in ['Temel Özellikler:', 'Öne Çıkan Özellikler']):
            mode = 'features'
            continue
        elif any(h in txt for h in ['Kutu İçeriği:', 'Kutu İçeriği', 'Set İçeriği ve Teknik Detaylar:']):
            mode = 'box'
            continue
        elif any(h in txt for h in ['Teknik Özellikler:', 'Sensör Kriterleri']):
            mode = 'specs'
            continue
        elif 'Fiyat' in txt:
            mode = 'price'
            
        # Price parsing
        if 'Liste Fiyatı:' in txt or 'Liste Fiyat:' in txt:
            # extract number
            # e.g., Liste Fiyatı: 22.220 TL + KDV or 9900 + KDV or 147620 + KDV
            nums = re.findall(r'[\d\.]+', txt.split(':')[-1])
            if nums:
                clean_num = nums[0].replace('.', '')
                try:
                    list_price = int(clean_num)
                except:
                    pass
        if 'İndirimli Fiyat' in txt or 'indirimli Fiyat' in txt:
            nums = re.findall(r'[\d\.]+', txt.split(':')[-1])
            if nums:
                clean_num = nums[0].replace('.', '')
                try:
                    sale_price = int(clean_num)
                except:
                    pass
                    
        # Mode collections
        if mode == 'features':
            if not txt.startswith('Fiyat') and not 'Kutu' in txt and not 'Teknik' in txt and not txt.startswith('ANA KATEGORİ'):
                features.append(txt)
        elif mode == 'box':
            if not txt.startswith('Fiyat') and not 'Teknik' in txt and not txt.startswith('ANA KATEGORİ') and not txt.startswith('Kategori:'):
                box_content.append(txt)
                
    products.append({
        'code': code,
        'name': name,
        'short_desc': short_desc,
        'detail_desc': detail_desc,
        'features': features,
        'box_content': box_content,
        'spec_tables': spec_tables,
        'list_price': list_price,
        'sale_price': sale_price
    })

with open('parsed_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print('Saved parsed_products.json successfully')
