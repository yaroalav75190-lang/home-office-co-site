"""Slice a tall full-page screenshot into a review sheet of columns.
Usage: python -I -X utf8 tools/sheet.py <in.jpg> <out.jpg> [slice_h=1800] [cols=3] [col_w=700]
"""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
slice_h = int(sys.argv[3]) if len(sys.argv) > 3 else 1800
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 3
col_w = int(sys.argv[5]) if len(sys.argv) > 5 else 700

im = Image.open(src).convert('RGB')
scale = col_w / im.width
slices = []
y = 0
while y < im.height:
    part = im.crop((0, y, im.width, min(y + slice_h, im.height)))
    slices.append(part.resize((col_w, max(1, round(part.height * scale))), Image.LANCZOS))
    y += slice_h
gap = 16
col_h = round(slice_h * scale)
rows = (len(slices) + cols - 1) // cols
sheet = Image.new('RGB', (cols * col_w + (cols - 1) * gap, rows * col_h + (rows - 1) * gap), (200, 200, 196))
for i, s in enumerate(slices):
    r, c = divmod(i, cols)
    sheet.paste(s, (c * (col_w + gap), r * (col_h + gap)))
sheet.save(out, quality=82)
print(out, sheet.size, f'{len(slices)} slices')
