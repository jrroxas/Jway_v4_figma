import urllib.request
import ssl

url = "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg"
dest = "c:\\Localhost\\jway-site\\public\\blog\\187_compressed.jpg"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://jway-20137624.hs-sites.com/blog/news-and-events/certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines",
    }
)

try:
    with urllib.request.urlopen(req, context=ctx) as response, open(dest, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
        print(f"Downloaded {len(data)} bytes to {dest}")
        print("First 20 bytes:", data[:20])
except Exception as e:
    print("Error:", e)
