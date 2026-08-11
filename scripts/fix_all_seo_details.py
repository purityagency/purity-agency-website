import re

# Fix 1: article-ia-pme-belgique.html description
with open("article-ia-pme-belgique.html", "r", encoding="utf-8") as f:
    c = f.read()
c = re.sub(
    r'<meta\s+name=["\']description["\']\s+content=["\'][^"\']*["\']',
    '<meta name="description" content="Guide 2026 : Comment intégrer l\'Intelligence Artificielle (Chatbots AI Act, RAG, automatisations) dans une PME ou chez un indépendant en Belgique.">',
    c
)
with open("article-ia-pme-belgique.html", "w", encoding="utf-8") as f:
    f.write(c)

# Fix 2: article-site-ne-convertit-pas.html description
with open("article-site-ne-convertit-pas.html", "r", encoding="utf-8") as f:
    c = f.read()
c = re.sub(
    r'<meta\s+name=["\']description["\']\s+content=["\'][^"\']*["\']',
    '<meta name="description" content="Audit de conversion web : 7 erreurs UX & techniques qui détruisent votre ROI, et les solutions pour transformer votre site en machine à prospect.">',
    c
)
with open("article-site-ne-convertit-pas.html", "w", encoding="utf-8") as f:
    f.write(c)

# Fix 3: Standardize og:image on all HTML files to https://purity-agency.be/assets/og-image.jpg
html_files = [
    "agence-web-charleroi.html",
    "article-cheques-entreprises-wallonie.html",
    "article-ia-pme-belgique.html",
    "article-prix-site-web-belgique.html",
    "article-seo-local-wallonie.html",
    "article-site-ne-convertit-pas.html",
    "blog.html",
    "services.html",
    "legal.html",
    "liens.html"
]

for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        c = f.read()
    c = re.sub(
        r'<meta\s+property=["\']og:image["\']\s+content=["\'][^"\']*["\']',
        '<meta property="og:image" content="https://purity-agency.be/assets/og-image.jpg">',
        c
    )
    c = re.sub(
        r'<meta\s+name=["\']twitter:image["\']\s+content=["\'][^"\']*["\']',
        '<meta name="twitter:image" content="https://purity-agency.be/assets/og-image.jpg">',
        c
    )
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(c)

print("✅ Méta-descriptions et images OG uniformisées sur toutes les pages.")
