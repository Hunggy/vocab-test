# -*- coding: utf-8 -*-
"""生成 PWA / iOS 应用图标（词汇测试 · 英语单词复习）。

输出三个 PNG（RGB、不透明、无 alpha）：
  icons/icon-192.png          常规 192px（any purpose）
  icons/icon-512.png          常规 512px（any purpose）
  icons/icon-maskable-512.png 512px maskable（内容限制在中央 80% 安全区）

设计：竖直渐变背景 #5aa0e6 → #357abd（accent 蓝色系，全出血），
白色粗体 "VT" 字标 + 下方白色短横线，简洁、192px 下依然清晰。
超采样 4x 绘制后 LANCZOS 缩小，保证抗锯齿平滑。

用法：python tools/make_icons.py  （在仓库根目录运行；确定性输出）
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "icons"

# 颜色（与站点 accent 保持一致）
GRAD_TOP = (0x5A, 0xA0, 0xE6)   # #5aa0e6 浅蓝
GRAD_BOTTOM = (0x35, 0x7A, 0xBD)  # #357abd 深蓝（hover 色）
WHITE = (255, 255, 255)
# 白字底部的微妙投影，增强对比但不做风格化
SHADOW = (23, 60, 102)          # 深蓝投影 #173c66

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\segoeuib.ttf",   # Segoe UI Bold（Windows 标配）
    r"C:\Windows\Fonts\arialbd.ttf",    # Arial Bold（回退）
    r"C:\Windows\Fonts\arial.ttf",      # Arial（最后回退）
]

SS = 4  # 超采样倍数


def _load_font(size: float) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    raise RuntimeError("找不到可用的粗体字体，请检查 FONT_CANDIDATES 路径")


def _vertical_gradient(size: int) -> Image.Image:
    """全出血竖直渐变背景，返回不透明 RGB 图。"""
    img = Image.new("RGB", (size, size), GRAD_BOTTOM)
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        r = round(GRAD_TOP[0] + (GRAD_BOTTOM[0] - GRAD_TOP[0]) * t)
        g = round(GRAD_TOP[1] + (GRAD_BOTTOM[1] - GRAD_TOP[1]) * t)
        b = round(GRAD_TOP[2] + (GRAD_BOTTOM[2] - GRAD_TOP[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b)
    return img


def _draw_icon(size: int, content_scale: float) -> Image.Image:
    """绘制一张图标。content_scale：内容占整图边长的比例（0~1）。"""
    big = size * SS
    base = _vertical_gradient(big)

    over = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)

    # ---- 内容几何：以整图边长为基准，随 content_scale 缩放 ----
    unit = big * content_scale  # 单位：内容区边长
    font = _load_font(unit * 0.52)

    text = "VT"
    # 精确测量字宽并水平居中（不用 anchor，兼容所有 Pillow 版本）
    bbox = d.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    cx = big // 2
    tx = cx - text_w // 2 - bbox[0]
    # 视觉垂直居中：字标略偏上，为下方短横线留出空间
    ty = (big - unit * 1.02) // 2 - bbox[1]

    # 柔和投影（深蓝，向下偏移，非模糊——小尺寸下更稳）
    d.text((tx + SS * 2, ty + SS * 4), text, font=font, fill=SHADOW + (140,))
    # 白色字标
    d.text((tx, ty), text, font=font, fill=WHITE + (255,))

    # 字标下方的白色短横线（点睛，宽度约为字宽的 46%）
    bar_w = text_w * 0.46
    bar_h = unit * 0.045
    bar_y = ty + bbox[1] + text_h + unit * 0.16
    d.rounded_rectangle(
        [cx - bar_w / 2, bar_y, cx + bar_w / 2, bar_y + bar_h],
        radius=bar_h / 2,
        fill=WHITE + (255,),
    )

    # 合成 + 缩小回目标尺寸（LANCZOS 抗锯齿）
    img = Image.alpha_composite(base.convert("RGBA"), over)
    img = img.resize((size, size), Image.LANCZOS)
    return img.convert("RGB")  # 丢弃 alpha，保证全不透明


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 常规图标：内容稍大（字标约占 62%）；maskable：限制在中央 80% 安全区
    specs = [
        ("icon-192.png", 192, 0.62),
        ("icon-512.png", 512, 0.62),
        ("icon-maskable-512.png", 512, 0.50),  # 0.62 × ~0.8 ≈ 0.50，与常规版视觉一致
    ]
    for name, size, scale in specs:
        img = _draw_icon(size, scale)
        img.save(OUT_DIR / name, format="PNG", optimize=True)
        print(f"wrote {OUT_DIR / name}  ({size}x{size}, {img.mode})")


if __name__ == "__main__":
    main()
