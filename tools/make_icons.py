# -*- coding: utf-8 -*-
"""从 icons/source.png 生成 PWA / iOS 图标。

`icons/source.png` 是 1500x1500 的成品图（已裁掉生成工具角落的水印）。
输出三个不透明 PNG：
  icons/icon-192.png          常规 192px（any purpose）
  icons/icon-512.png          常规 512px（any purpose）
  icons/icon-maskable-512.png 512px maskable（内容在中央 80% 安全区）

常规图标会再向中心裁掉约 6.7% 的边距，让书本+闪电在 192px 下更醒目；
maskable 用完整 source，四周保留安全区。

用法：python tools/make_icons.py  （在仓库根目录运行；确定性输出）
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
ICON_DIR = REPO / "icons"
SOURCE = ICON_DIR / "source.png"

# 常规图标：裁掉 source 四周约 100/1500 的边距
TIGHT_INSET_RATIO = 100 / 1500


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"找不到源图：{SOURCE}")

    src = Image.open(SOURCE).convert("RGB")
    w, h = src.size
    inset = round(min(w, h) * TIGHT_INSET_RATIO)
    tight = src.crop((inset, inset, w - inset, h - inset))

    outputs = [
        ("icon-192.png", tight, 192),
        ("icon-512.png", tight, 512),
        ("icon-maskable-512.png", src, 512),
    ]
    for name, image, size in outputs:
        out = ICON_DIR / name
        image.resize((size, size), Image.LANCZOS).save(out, format="PNG", optimize=True)
        print(f"wrote {out}  ({size}x{size}, RGB)")


if __name__ == "__main__":
    main()
