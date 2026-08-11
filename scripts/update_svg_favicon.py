import base64

with open('assets/favicon.png', 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 192 192" width="100%" height="100%">
  <rect width="192" height="192" fill="#060309" rx="36"/>
  <image width="192" height="192" xlink:href="data:image/png;base64,{b64_data}"/>
</svg>'''

with open('assets/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("✅ favicon.svg updated with Octomask logo!")
