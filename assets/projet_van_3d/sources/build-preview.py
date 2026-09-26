"""Build the self-contained HTML from the existing GLB, viewer and photo sources."""
from pathlib import Path
from PIL import Image, ImageOps
import base64
import html
import io
import json
import os
import shutil
import subprocess
import zipfile

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
OUT = ROOT / 'deliverables' / 'van-portfolio' if SRC.name == 'van-build' else SRC.parent
PHOTOS = OUT / 'photos'
PHOTOS.mkdir(exist_ok=True)
manifest = json.loads((SRC / 'photo-manifest.json').read_text())
photo_html = (SRC / 'photos.template.html').read_text()
cards = []
values = {}
for i, entry in enumerate(manifest, 1):
    original = ROOT / 'upload' / entry['file']
    image = ImageOps.exif_transpose(Image.open(original if original.exists() else PHOTOS / f'{i:02d}.jpg')).convert('RGB')
    image.thumbnail((1440, 1440), Image.Resampling.LANCZOS)
    encoded = io.BytesIO()
    image.save(encoded, format='JPEG', quality=84, optimize=True, progressive=True)
    (PHOTOS / f'{i:02d}.jpg').write_bytes(encoded.getvalue())
    values[f'PHOTO_{i}'] = 'data:image/jpeg;base64,' + base64.b64encode(encoded.getvalue()).decode()
    values[f'WIDTH_{i}'], values[f'HEIGHT_{i}'] = map(str, image.size)
    alt, phase, title, description = (html.escape(entry[key], quote=True) for key in ['alt','phase','title','description'])
    cards.append(f'''<li><button class="photo-card" type="button" aria-label="Agrandir la photo {i} : {title}"><span class="photo-thumb"><img src="{{{{PHOTO_{i}}}}}" width="{image.width}" height="{image.height}" alt="{alt}" loading="lazy" decoding="async"><span class="photo-expand" aria-hidden="true">↗</span></span><span class="photo-step">{i:02d} / {phase}</span><strong>{title}</strong><span class="photo-summary">{description}</span></button></li>''')
photo_html = photo_html.replace('<!-- PHOTO_CARDS -->', '\n'.join(cards))
for key, value in values.items():
    photo_html = photo_html.replace('{{' + key + '}}', value)

subprocess.run([str(SRC/'node_modules/.bin/esbuild'), str(SRC/'final-entry.js'), '--bundle', '--format=iife', '--minify', '--outfile='+str(SRC/'van-viewer.bundle.js')], check=True)
template = (SRC / 'index.template.html').read_text()
model = base64.b64encode((OUT / 'van-complet.glb').read_bytes()).decode()
bundle = (SRC / 'van-viewer.bundle.js').read_text().replace('</script', '<\\/script')
result = (template.replace('/* PHOTO_STYLES */', (SRC / 'photos.css').read_text())
    .replace('<!-- PHOTO_SECTION -->', photo_html)
    .replace('<!-- PHOTO_SCRIPT -->', '<script>' + (SRC / 'photos.js').read_text() + '</script>')
    .replace('<!-- APPLICATION_SCRIPT -->', f'<script id="van-model" type="application/octet-stream">{model}</script>\n<script>{bundle}</script>'))
(OUT / 'index.html').write_text(result)
standalone = OUT.parent / 'apercu-interactif.html'
shutil.copyfile(OUT / 'index.html', standalone)
for name in ['model.js','viewer.js','final-entry.js','index.template.html','photos.css','photos.js','photos.template.html','photo-manifest.json','build-preview.py']:
    destination = OUT / 'sources' / name
    if (SRC / name).resolve() != destination.resolve():
        shutil.copyfile(SRC / name, destination)
archive = OUT.parent / 'van-portfolio.zip'
zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for path in sorted(OUT.rglob('*')):
        if path.is_file():
            z.write(path, path.relative_to(OUT.parent))
zip_bytes = zip_buffer.getvalue()
with archive.open('wb', buffering=0) as target:
    remaining = memoryview(zip_bytes)
    while remaining:
        written = target.write(remaining[:262144])
        if not written:
            raise IOError('Incomplete archive write')
        remaining = remaining[written:]
    os.fsync(target.fileno())
with zipfile.ZipFile(archive) as check:
    assert check.testzip() is None
print(json.dumps({'html_bytes': (OUT/'index.html').stat().st_size, 'photos': len(manifest), 'zip_bytes': archive.stat().st_size}))
