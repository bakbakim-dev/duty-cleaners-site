"""Render the site header logo (navy "DC" plate + stacked DUTY / CLEANERS
wordmark, Navigation.tsx) as a transparent PNG for BookingKoala's Theme
Builder, which takes an image rather than HTML. 4x scale for sharp display.

    python site/scripts/render-booking-logo.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

S = 4                       # render scale
NAVY = (28, 60, 99, 255)    # --brand-navy 213 56% 25%  -> #1c3c63
NAVY70 = (28, 60, 99, 179)  # text-brand-navy/70
WHITE = (255, 255, 255, 255)
FONTS = Path("C:/Windows/Fonts")

plate = 40 * S
gap = 10 * S
serif = ImageFont.truetype(str(FONTS / "georgiab.ttf"), int(18 * S))
small = ImageFont.truetype(str(FONTS / "segoeuib.ttf"), int(9.6 * S))
big = ImageFont.truetype(str(FONTS / "segoeuib.ttf"), int(18 * S))


def tracked_width(draw, text, font, tracking):
    return sum(draw.textlength(ch, font=font) for ch in text) + tracking * (len(text) - 1)


def draw_tracked(draw, xy, text, font, tracking, fill):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
duty_track = 0.3 * 9.6 * S
cleaners_track = 0.08 * 18 * S
word_w = max(tracked_width(probe, "DUTY", small, duty_track),
             tracked_width(probe, "CLEANERS", big, cleaners_track))
pad = 2 * S
width = int(plate + gap + word_w + pad * 2)
height = int(plate + pad * 2)

img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Plate with the serif monogram, centred.
d.rectangle([pad, pad, pad + plate, pad + plate], fill=NAVY)
box = d.textbbox((0, 0), "DC", font=serif)
tw, th = box[2] - box[0], box[3] - box[1]
d.text((pad + (plate - tw) / 2 - box[0], pad + (plate - th) / 2 - box[1]), "DC", font=serif, fill=WHITE)

# Stacked wordmark, vertically centred on the plate like leading-none + mt-0.5.
x = pad + plate + gap
duty_box = d.textbbox((0, 0), "DUTY", font=small)
big_box = d.textbbox((0, 0), "CLEANERS", font=big)
duty_h = duty_box[3] - duty_box[1]
big_h = big_box[3] - big_box[1]
block = duty_h + 4 * S + big_h
top = pad + (plate - block) / 2
draw_tracked(d, (x, top - duty_box[1]), "DUTY", small, duty_track, NAVY70)
draw_tracked(d, (x, top + duty_h + 4 * S - big_box[1]), "CLEANERS", big, cleaners_track, NAVY)

out = Path(__file__).resolve().parents[2] / "brand" / "booking-logo.png"
out.parent.mkdir(exist_ok=True)
img.save(out)
print(f"wrote {out} ({width}x{height})")
