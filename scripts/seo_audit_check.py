import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

print(f"🔍 Audit SEO approfondi sur {len(html_files)} fichiers HTML...")

for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"\n📄 {fpath}:")
    
    # Title
    title_match = re.search(r'<title[^>]*>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "❌ MANQUANT"
    print(f"   [Title] ({len(title)} chars): {title}")

    # Meta Description
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    desc = desc_match.group(1).strip() if desc_match else "❌ MANQUANT"
    print(f"   [Description] ({len(desc)} chars): {desc}")

    # Canonical
    canon_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', content, re.IGNORECASE)
    canon = canon_match.group(1).strip() if canon_match else "❌ MANQUANT"
    print(f"   [Canonical]: {canon}")

    # OG Image
    og_img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    og_img = og_img_match.group(1).strip() if og_img_match else "❌ MANQUANT"
    print(f"   [OG Image]: {og_img}")

    # Favicon check
    has_favicon = 'assets/favicon' in content or 'assets/logo' in content
    print(f"   [Favicons Octomask]: {'✅ OK' if has_favicon else '❌ MANQUANT'}")

print("\n✅ Audit SEO terminé.")
