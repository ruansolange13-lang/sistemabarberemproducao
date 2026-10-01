import re
import json

with open("/tmp/full_bundle.js", "r", encoding="utf-8", errors="ignore") as f:
    js = f.read()

print("JS length:", len(js))
urls = set(re.findall(r"https?://[^\s\"\'\`<>]+", js))
for u in sorted(urls):
    if any(ext in u for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg', 'wa.me', 'whatsapp', 'maps', 'cdn']):
        print("Asset/Link:", u)
