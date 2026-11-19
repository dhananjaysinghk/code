"""
PROJECT 456: ARCHITECTURE OF SURVIVAL
High-Resolution Generative Artwork Renderer for CODE ART ATTACK 2026
Theme: SQUID GAME 🦑
"""

import math
import random
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH = 1920
HEIGHT = 1080

def create_artwork():
    # Base Image (RGB)
    img = Image.new("RGBA", (WIDTH, HEIGHT), (7, 8, 13, 255))
    draw = ImageDraw.Draw(img)

    # Load Windows fonts
    try:
        font_large_bold = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 42)
        font_title_kr = ImageFont.truetype("C:\\Windows\\Fonts\\malgunbd.ttf", 32)
        font_medium = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 22)
        font_mono = ImageFont.truetype("C:\\Windows\\Fonts\\consola.ttf", 16)
        font_mono_bold = ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 20)
        font_huge_prize = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 46)
        font_small = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 13)
        font_symbol = ImageFont.truetype("C:\\Windows\\Fonts\\malgunbd.ttf", 26)
    except Exception:
        font_large_bold = ImageFont.load_default()
        font_title_kr = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_mono = ImageFont.load_default()
        font_mono_bold = ImageFont.load_default()
        font_huge_prize = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_symbol = ImageFont.load_default()

    # 1. Perspective Grid Floor
    horizon_y = int(HEIGHT * 0.62)
    vp_x = WIDTH // 2

    # Floor gradient
    floor_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    floor_draw = ImageDraw.Draw(floor_layer)

    for y in range(horizon_y, HEIGHT):
        factor = (y - horizon_y) / (HEIGHT - horizon_y)
        r = int(7 + factor * 8)
        g = int(9 + factor * 11)
        b = int(15 + factor * 16)
        floor_draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 240))

    # Floor grid perspective lines
    grid_color = (255, 0, 85, 38) # Neon pink surveillance grid
    # Transverse lines
    curr_y = horizon_y + 12
    step = 8.0
    while curr_y < HEIGHT:
        floor_draw.line([(0, int(curr_y)), (WIDTH, int(curr_y))], fill=grid_color, width=1)
        step *= 1.25
        curr_y += step

    # Radial lines
    for x in range(-WIDTH // 2, int(WIDTH * 1.5), int(WIDTH * 0.065)):
        floor_draw.line([(vp_x, horizon_y), (x, HEIGHT)], fill=grid_color, width=1)

    img = Image.alpha_composite(img, floor_layer)
    draw = ImageDraw.Draw(img)

    # 2. Flanking Escher Labyrinths (Impossible Pastel Staircases)
    stairs_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    stairs_draw = ImageDraw.Draw(stairs_layer)

    def draw_escher_stairs(ox, oy, scale_dir=1):
        step_w = 28 * scale_dir
        step_h = 16
        
        # Flight 1: Mint stairs
        for s in range(7):
            sx = ox + s * step_w
            sy = oy - s * step_h
            stairs_draw.polygon([
                (sx, sy), (sx + step_w, sy), (sx + step_w, sy + step_h), (sx, sy + step_h)
            ], fill=(0, 203, 180, 210), outline=(0, 0, 0, 180))
            x0 = min(sx, sx + step_w)
            x1 = max(sx, sx + step_w)
            stairs_draw.rectangle([x0, sy + step_h, x1, sy + step_h + 35], fill=(12, 16, 24, 190))

        # Flight 2: Pink stairs transverse
        for s in range(6):
            sx = ox + 7 * step_w + s * step_w * 0.8
            sy = oy - 7 * step_h + s * step_h * 0.9
            stairs_draw.polygon([
                (sx, sy), (sx + step_w * 0.8, sy), (sx + step_w * 0.8, sy + step_h), (sx, sy + step_h)
            ], fill=(255, 77, 132, 210), outline=(0, 0, 0, 180))
            x0 = min(sx, sx + step_w * 0.8)
            x1 = max(sx, sx + step_w * 0.8)
            stairs_draw.rectangle([x0, sy + step_h, x1, sy + step_h + 40], fill=(20, 10, 18, 190))

        # Hooded Guard Silhouettes
        guard_x = ox + 3 * step_w
        guard_y = oy - 3 * step_h - 10
        stairs_draw.ellipse([guard_x - 7, guard_y - 20, guard_x + 7, guard_y - 6], fill=(255, 0, 85, 255))
        stairs_draw.rectangle([guard_x - 6, guard_y - 6, guard_x + 6, guard_y + 14], fill=(255, 0, 85, 255))
        stairs_draw.ellipse([guard_x - 4, guard_y - 18, guard_x + 4, guard_y - 10], fill=(10, 10, 14, 255))
        stairs_draw.ellipse([guard_x - 2, guard_y - 16, guard_x + 2, guard_y - 12], outline=(255, 255, 255, 255), width=1)

    draw_escher_stairs(WIDTH * 0.12, HEIGHT * 0.52, 1)
    draw_escher_stairs(WIDTH * 0.88, HEIGHT * 0.52, -1)

    img = Image.alpha_composite(img, stairs_layer)
    draw = ImageDraw.Draw(img)

    # 3. Sacred Geometry Glowing Mandala (○ △ □)
    geo_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    geo_draw = ImageDraw.Draw(geo_layer)
    cx, cy = WIDTH // 2, int(HEIGHT * 0.44)

    # Outer Neon Circle (Pink)
    r_circle = 180
    geo_draw.ellipse([cx - r_circle, cy - r_circle, cx + r_circle, cy + r_circle], outline=(255, 0, 85, 140), width=3)
    # Circle node markers
    for i in range(12):
        ang = (i / 12.0) * math.pi * 2
        px = cx + math.cos(ang) * r_circle
        py = cy + math.sin(ang) * r_circle
        geo_draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(255, 0, 85, 230))

    # Inner Neon Triangle (White / Silver)
    r_tri = 135
    tri_pts = []
    for i in range(3):
        ang = (i / 3.0) * math.pi * 2 - math.pi / 2
        tri_pts.append((cx + math.cos(ang) * r_tri, cy + math.sin(ang) * r_tri))
    geo_draw.polygon(tri_pts, outline=(255, 255, 255, 180), width=3)

    # Central Neon Square (Mint Green)
    r_sq = 80
    geo_draw.rectangle([cx - r_sq, cy - r_sq, cx + r_sq, cy + r_sq], outline=(3, 218, 197, 200), width=3)

    img = Image.alpha_composite(img, geo_layer)
    draw = ImageDraw.Draw(img)

    # 4. Suspended Giant Glass Piggy Bank
    pig_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pig_draw = ImageDraw.Draw(pig_layer)
    pig_y = int(HEIGHT * 0.22)
    pig_w, pig_h = 160, 115

    # Hanging Chains from dark bunker ceiling
    for y in range(0, pig_y - 60, 18):
        pig_draw.rectangle([cx - 85, y, cx - 75, y + 14], outline=(100, 105, 120, 200), width=2)
        pig_draw.rectangle([cx + 75, y, cx + 85, y + 14], outline=(100, 105, 120, 200), width=2)

    # Golden Caustic Radiance inside the glass
    for r in range(pig_w, 10, -8):
        alpha = int((1.0 - (r / pig_w)) * 120)
        pig_draw.ellipse([cx - r, pig_y - int(r * 0.72), cx + r, pig_y + int(r * 0.72)], fill=(255, 215, 0, alpha))

    # Glass Silhouette & Specular Rim
    pig_draw.ellipse([cx - pig_w, pig_y - pig_h, cx + pig_w, pig_y + pig_h], outline=(255, 255, 255, 160), width=4)
    # Glass Snout
    pig_draw.ellipse([cx + pig_w - 20, pig_y - 20, cx + pig_w + 35, pig_y + 20], fill=(255, 215, 0, 80), outline=(255, 255, 255, 180), width=2)
    # Coin Slot
    pig_draw.rectangle([cx - 35, pig_y - pig_h - 4, cx + 35, pig_y - pig_h + 4], fill=(255, 215, 0, 255))
    # Glass Ears
    pig_draw.polygon([(cx - 70, pig_y - pig_h + 10), (cx - 45, pig_y - pig_h - 28), (cx - 20, pig_y - pig_h + 15)], fill=(255, 255, 255, 70), outline=(255, 255, 255, 160))

    # Glowing coins floating inside
    random.seed(456)
    for _ in range(45):
        icx = cx + random.randint(-int(pig_w * 0.65), int(pig_w * 0.65))
        icy = pig_y + random.randint(-int(pig_h * 0.4), int(pig_h * 0.6))
        irad = random.randint(8, 14)
        pig_draw.ellipse([icx - irad, icy - irad, icx + irad, icy + irad], fill=(255, 215, 0, 220), outline=(180, 140, 0, 255), width=2)

    img = Image.alpha_composite(img, pig_layer)
    draw = ImageDraw.Draw(img)

    # 5. Front Man Faceted Geometric 3D Mask (Hovering below Piggy Bank)
    mask_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    mask_draw = ImageDraw.Draw(mask_layer)
    mask_cy = int(HEIGHT * 0.38)

    # Facets
    facets = [
        # (pts, fill_rgb)
        ([(cx, mask_cy - 70), (cx - 38, mask_cy - 50), (cx, mask_cy - 15)], (55, 58, 68, 240)),
        ([(cx, mask_cy - 70), (cx + 38, mask_cy - 50), (cx, mask_cy - 15)], (38, 40, 48, 240)),
        ([(cx - 38, mask_cy - 50), (cx - 55, mask_cy - 8), (cx, mask_cy - 15)], (75, 78, 92, 240)),
        ([(cx + 38, mask_cy - 50), (cx + 55, mask_cy - 8), (cx, mask_cy - 15)], (26, 28, 34, 240)),
        ([(cx - 55, mask_cy - 8), (cx - 30, mask_cy + 30), (cx, mask_cy - 15)], (48, 50, 60, 240)),
        ([(cx + 55, mask_cy - 8), (cx + 30, mask_cy + 30), (cx, mask_cy - 15)], (20, 22, 28, 240)),
        ([(cx, mask_cy - 15), (cx - 30, mask_cy + 30), (cx, mask_cy + 45)], (62, 65, 78, 240)),
        ([(cx, mask_cy - 15), (cx + 30, mask_cy + 30), (cx, mask_cy + 45)], (30, 32, 40, 240)),
        ([(cx - 30, mask_cy + 30), (cx, mask_cy + 70), (cx, mask_cy + 45)], (40, 42, 50, 240)),
        ([(cx + 30, mask_cy + 30), (cx, mask_cy + 70), (cx, mask_cy + 45)], (18, 20, 24, 240)),
    ]

    for poly, col in facets:
        mask_draw.polygon(poly, fill=col, outline=(255, 0, 85, 120))

    # Glowing eyes in Front Man mask
    mask_draw.ellipse([cx - 20, mask_cy - 22, cx - 12, mask_cy - 16], fill=(255, 0, 85, 255))
    mask_draw.ellipse([cx + 12, mask_cy - 22, cx + 20, mask_cy - 16], fill=(255, 0, 85, 255))

    img = Image.alpha_composite(img, mask_layer)
    draw = ImageDraw.Draw(img)

    # 6. Foreground Centerpiece: Giant Young-hee Doll (Red Light Surveillance Mode)
    doll_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    doll_draw = ImageDraw.Draw(doll_layer)
    doll_cy = int(HEIGHT * 0.65)

    # Yellow Dress & Orange Collar
    doll_draw.polygon([
        (cx - 60, doll_cy + 70), (cx + 60, doll_cy + 70),
        (cx + 130, doll_cy + 220), (cx - 130, doll_cy + 220)
    ], fill=(245, 197, 24, 255), outline=(180, 140, 0, 255))

    # Orange Shirt Collar
    doll_draw.pieslice([cx - 50, doll_cy + 35, cx + 50, doll_cy + 105], 0, 180, fill=(230, 81, 0, 255))

    # Twin Pigtails
    doll_draw.ellipse([cx - 95, doll_cy + 10, cx - 55, doll_cy + 75], fill=(20, 22, 28, 255))
    doll_draw.ellipse([cx + 55, doll_cy + 10, cx + 95, doll_cy + 75], fill=(20, 22, 28, 255))
    # Red ribbons
    doll_draw.rectangle([cx - 78, doll_cy + 20, cx - 68, doll_cy + 30], fill=(255, 0, 85, 255))
    doll_draw.rectangle([cx + 68, doll_cy + 20, cx + 78, doll_cy + 30], fill=(255, 0, 85, 255))

    # Doll Face (Skin)
    doll_draw.ellipse([cx - 68, doll_cy - 70, cx + 68, doll_cy + 65], fill=(252, 226, 200, 255))

    # Hair bangs
    doll_draw.chord([cx - 70, doll_cy - 75, cx + 70, doll_cy + 10], 180, 360, fill=(22, 25, 31, 255))
    doll_draw.rectangle([cx - 64, doll_cy - 52, cx + 64, doll_cy - 20], fill=(22, 25, 31, 255))

    # Cheeks
    doll_draw.ellipse([cx - 45, doll_cy + 10, cx - 22, doll_cy + 24], fill=(255, 107, 107, 110))
    doll_draw.ellipse([cx + 22, doll_cy + 10, cx + 45, doll_cy + 24], fill=(255, 107, 107, 110))

    # Crimson Optical Surveillance Eyes (Red Light Alert)
    eye_y = doll_cy - 8
    eye_offset = 30
    for ex in [cx - eye_offset, cx + eye_offset]:
        # Eye white
        doll_draw.ellipse([ex - 16, eye_y - 12, ex + 16, eye_y + 12], fill=(255, 255, 255, 255))
        # Glowing Crimson Iris
        doll_draw.ellipse([ex - 9, eye_y - 9, ex + 9, eye_y + 9], fill=(255, 0, 85, 255))
        # Pupil aperture
        doll_draw.ellipse([ex - 4, eye_y - 4, ex + 4, eye_y + 4], fill=(0, 0, 0, 255))
        # Glint
        doll_draw.ellipse([ex - 5, eye_y - 5, ex - 2, eye_y - 2], fill=(255, 255, 255, 255))

    # Eerie smile
    doll_draw.arc([cx - 15, doll_cy + 20, cx + 15, doll_cy + 36], 20, 160, fill=(180, 40, 40, 255), width=2)

    # 7. Red Light Scanning Laser Beams projecting across canvas
    for ex in [cx - eye_offset, cx + eye_offset]:
        doll_draw.line([(ex, eye_y), (WIDTH * 0.15, HEIGHT)], fill=(255, 0, 85, 180), width=2)
        doll_draw.line([(ex, eye_y), (WIDTH * 0.85, HEIGHT)], fill=(255, 0, 85, 180), width=2)
        doll_draw.line([(ex, eye_y), (WIDTH * 0.50, HEIGHT)], fill=(255, 0, 85, 220), width=3)

    img = Image.alpha_composite(img, doll_layer)
    draw = ImageDraw.Draw(img)

    # 8. Golden Won Physics Coins Cascading Across Scene
    coin_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    coin_draw = ImageDraw.Draw(coin_layer)
    random.seed(1234)

    for _ in range(85):
        coin_x = random.randint(int(WIDTH * 0.15), int(WIDTH * 0.85))
        coin_y = random.randint(int(HEIGHT * 0.28), int(HEIGHT * 0.95))
        c_rad = random.randint(10, 18)

        # Outer Gold
        coin_draw.ellipse([coin_x - c_rad, coin_y - c_rad, coin_x + c_rad, coin_y + c_rad], fill=(255, 215, 0, 230), outline=(184, 134, 11, 255), width=2)
        # Inner rim
        coin_draw.ellipse([coin_x - int(c_rad * 0.8), coin_y - int(c_rad * 0.8), coin_x + int(c_rad * 0.8), coin_y + int(c_rad * 0.8)], outline=(218, 165, 32, 200), width=1)
        # Specular glint
        coin_draw.ellipse([coin_x - 5, coin_y - 5, coin_x - 1, coin_y - 1], fill=(255, 255, 255, 220))

    img = Image.alpha_composite(img, coin_layer)
    draw = ImageDraw.Draw(img)

    # 9. Dystopian Surveillance HUD & Contest Telemetry
    hud_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    hud_draw = ImageDraw.Draw(hud_layer)

    # Top Navigation Glass Bar
    hud_draw.rectangle([0, 0, WIDTH, 80], fill=(7, 9, 14, 220), outline=(255, 255, 255, 35))

    # Header Left: Contest & Theme
    hud_draw.rectangle([28, 14, 150, 66], fill=(0, 0, 0, 180), outline=(255, 0, 85, 200), width=2)
    hud_draw.text((38, 22), "○ △ □", font=font_symbol, fill=(255, 0, 85, 255))
    hud_draw.text((170, 16), "CODE ART ATTACK 2026", font=font_large_bold, fill=(255, 255, 255, 255))
    hud_draw.text((172, 54), "THEME: SQUID GAME // 오징어 게임", font=font_title_kr, fill=(3, 218, 197, 255))

    # Center: The 45.6 Billion Won Prize Display
    center_box_w = 420
    center_box_x = (WIDTH - center_box_w) // 2
    hud_draw.rectangle([center_box_x, 8, center_box_x + center_box_w, 72], fill=(12, 15, 24, 200), outline=(255, 215, 0, 160), width=2)
    hud_draw.text((center_box_x + 80, 12), "ACCUMULATED PRIZE POOL", font=font_mono, fill=(203, 213, 225, 255))
    hud_draw.text((center_box_x + 35, 26), "₩ 45,600,000,000", font=font_huge_prize, fill=(255, 215, 0, 255))

    # Right: Surveillance State Alert
    hud_draw.rectangle([WIDTH - 290, 14, WIDTH - 28, 66], fill=(35, 3, 12, 220), outline=(255, 0, 85, 255), width=2)
    hud_draw.ellipse([WIDTH - 275, 32, WIDTH - 255, 52], fill=(255, 0, 85, 255))
    hud_draw.text((WIDTH - 245, 18), "SURVEILLANCE AI", font=font_small, fill=(148, 163, 184, 255))
    hud_draw.text((WIDTH - 245, 34), "RED LIGHT ⚠️", font=font_large_bold, fill=(255, 0, 85, 255))

    # Left Telemetry Panel (Dossier & Vitals)
    hud_draw.rectangle([28, 100, 260, 420], fill=(13, 16, 24, 210), outline=(3, 218, 197, 180), width=2)
    hud_draw.text((40, 112), "SUBJECT DOSSIER", font=font_mono_bold, fill=(148, 163, 184, 255))
    hud_draw.line([(40, 136), (248, 136)], fill=(255, 255, 255, 40), width=1)
    
    hud_draw.text((40, 146), "PLAYER 456", font=font_large_bold, fill=(3, 218, 197, 255))
    hud_draw.text((40, 190), "SEONG GI-HUN", font=font_medium, fill=(255, 255, 255, 255))
    hud_draw.text((40, 220), "STATUS: SURVIVOR", font=font_mono_bold, fill=(3, 218, 197, 255))
    hud_draw.text((40, 250), "HEART RATE: 138 BPM", font=font_mono_bold, fill=(255, 0, 85, 255))

    # ECG Wave
    ecg_y = 310
    hud_draw.rectangle([40, ecg_y - 25, 248, ecg_y + 25], fill=(0, 0, 0, 180))
    pts = [
        (40, ecg_y), (70, ecg_y), (85, ecg_y - 5), (95, ecg_y + 6),
        (105, ecg_y - 22), (115, ecg_y + 20), (125, ecg_y - 4), (145, ecg_y),
        (185, ecg_y), (200, ecg_y - 22), (210, ecg_y + 20), (220, ecg_y), (248, ecg_y)
    ]
    hud_draw.line(pts, fill=(255, 0, 85, 255), width=2)

    hud_draw.text((40, 350), "MOTION: STATIONARY (SAFE)", font=font_mono, fill=(3, 218, 197, 255))
    hud_draw.text((40, 375), "SECURITY: FRONT MAN", font=font_mono, fill=(255, 0, 85, 255))

    # Roster Attrition Matrix (456 units)
    hud_draw.rectangle([28, 435, 260, 560], fill=(13, 16, 24, 210), outline=(255, 0, 85, 180), width=2)
    hud_draw.text((40, 445), "ROSTER (455 DEAD / 1 ALIVE)", font=font_small, fill=(148, 163, 184, 255))
    
    grid_start_x = 42
    grid_start_y = 470
    for idx in range(1, 241):
        gx = grid_start_x + ((idx - 1) % 16) * 13
        gy = grid_start_y + ((idx - 1) // 16) * 6
        if idx == 1:
            hud_draw.rectangle([gx, gy, gx + 6, gy + 4], fill=(3, 218, 197, 255)) # Survivor
        else:
            hud_draw.rectangle([gx, gy, gx + 6, gy + 4], fill=(255, 0, 85, 60))

    # Bottom Right Verification Watermark & Form Link
    hud_draw.rectangle([WIDTH - 420, HEIGHT - 75, WIDTH - 28, HEIGHT - 20], fill=(10, 13, 20, 220), outline=(255, 255, 255, 40), width=1)
    hud_draw.text((WIDTH - 405, HEIGHT - 68), "GENERATIVE CODE ARTWORK // HTML5 + PYTHON", font=font_small, fill=(148, 163, 184, 255))
    hud_draw.text((WIDTH - 405, HEIGHT - 46), "SUBMISSION: https://forms.gle/kDchD4Txeh4D3rxD6", font=font_mono, fill=(3, 218, 197, 255))

    img = Image.alpha_composite(img, hud_layer)

    # 10. Subtle Scanlines & CRT Bloom effect
    scanline_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(scanline_img)
    for y in range(0, HEIGHT, 4):
        s_draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, 35), width=1)

    img = Image.alpha_composite(img, scanline_img)

    # Convert to RGB and Save
    final_img = img.convert("RGB")
    final_img.save("screenshot.png", "PNG", quality=98)
    final_img.save("artwork.png", "PNG", quality=98)
    print("Artwork screenshot saved successfully: screenshot.png (1920x1080)")

if __name__ == "__main__":
    create_artwork()
