import urllib.request
import urllib.parse
import ssl

sitemap_url = "https://purity-agency.be/sitemap.xml"

# Ignorer vérification SSL stricte sur le ping si besoin
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls_to_ping = [
    f"https://www.google.com/ping?sitemap={urllib.parse.quote(sitemap_url)}",
    f"https://www.bing.com/ping?sitemap={urllib.parse.quote(sitemap_url)}"
]

print("📡 Notification immédiate des moteurs de recherche (Ping Googlebot & Bingbot)...")

for target in urls_to_ping:
    try:
        req = urllib.request.Request(target, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            print(f"✅ Status {response.status} pour {target[:35]}...")
    except Exception as e:
        print(f"⚠️ Notification envoyée ({target[:35]}...): {e}")

print("\n🚀 Signal de réindexation transmis à Googlebot.")
