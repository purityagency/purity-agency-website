import glob

favicon_block = '''<link rel="icon" href="assets/favicon.ico" sizes="any">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="192x192" href="assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">'''

html_files = glob.glob("*.html")
updated_count = 0

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">' in content:
        new_content = content.replace(
            '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
            favicon_block
        )
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated_count += 1
        print(f"Updated: {filepath}")

print(f"✅ Total {updated_count} HTML files updated with full Octomask favicons set!")
