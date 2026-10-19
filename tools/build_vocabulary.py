#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""由 source/*.csv 與 data/source/*.csv 產生 vocabulary.json（可重跑）。

用法
----
    python tools/build_vocabulary.py              # 產生 vocabulary.json
    python tools/build_vocabulary.py --check      # 只比對現有 vocabulary.json，不寫檔
    python tools/build_vocabulary.py --show 3     # 另印前 3 組（--show all 全部）
    python tools/build_vocabulary.py --strict     # 有 warning 時 exit 1

資料來源
--------
- 先掃描 `source/`，再掃描 `data/source/`；相對路徑相同的檔案以 `source/` 為準。
- 所有 *.csv 依相對路徑（不分大小寫）排序讀取。
- 檔名（不含副檔名）就是批次 key；`custom` / `all` 為保留名稱，警告後略過。
- 表頭可用中英文別名；有 `batch` / `批次` 欄位時可逐列覆蓋批次 key。
- 一個 CSV = 一次大測（一個批次）。`deck` 欄位決定所屬牌組，預設 `本年度課程`；
  `seg` / `exam` 可由欄位或檔名（`seg2_exam3_...`、`第2段第3次...`）指定，
  只有一邊時另一邊補 1 並警告。`label` 未給時自動產生 `第{seg}段・第{exam}次大測`，
  沒有 seg/exam 則用檔名。
- 一列一組：word、chinese 必填；synonym 有值 → 產生 a/b 兩張卡（共用 id），
  否則只產生 a 一張卡（不輸出 b 欄位）。
- id 以現有 vocabulary.json 的 (批次, a, b) 為準重複使用；新條目從現有最大 id + 1
  開始，依檔案／列順序遞增。
- 輸出頂層 `batches`（批次 metadata）與 `groups`（單字卡）。
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
from pathlib import Path

# Windows 主控台預設可能是 GBK，強制用 UTF-8 輸出（中文訊息才不會爆掉）
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIRS = [ROOT / "source", ROOT / "data" / "source"]
VOCAB_PATH = ROOT / "vocabulary.json"

RESERVED_STEMS = {"custom", "all"}

DEFAULT_DECK = "本年度課程"
LEGACY_DECK = "上年英語班生字"

# 欄位別名（比對前會先 strip + lower）
ALIASES = {
    "a": {"word", "英文", "单词", "單詞"},
    "ch": {"chinese", "中文", "释义", "釋義", "词义", "詞義"},
    "b": {"synonym", "同义词", "同義詞"},
    "ex": {"example", "例句"},
    "cn": {"example_cn", "例句翻译", "例句中文", "例句翻譯"},
    "batch": {"batch", "批次"},
    "deck": {"deck", "分类", "分類", "来源", "來源", "类别", "類別"},
    "seg": {"seg", "segment", "段", "第几段", "第幾段"},
    "exam": {"exam", "次", "第几次", "第幾次", "大测", "大測"},
    "label": {"label", "名称", "名稱", "批次名", "显示名", "顯示名"},
}

# 檔名裡的 seg/exam（日期檔名如 2026-05-09 不會誤中）
SEG_PATTERNS = (
    re.compile(r"seg\s*[_-]?\s*(\d+)", re.I),
    re.compile(r"第\s*(\d+)\s*段"),
)
EXAM_PATTERNS = (
    re.compile(r"exam\s*[_-]?\s*(\d+)", re.I),
    re.compile(r"第\s*(\d+)\s*次"),
)

ENCODINGS = ("utf-8-sig", "gb18030", "big5")


class Reporter:
    """收集 warning；--strict 時用來決定 exit code。"""

    def __init__(self) -> None:
        self.count = 0

    def warn(self, message: str) -> None:
        self.count += 1
        print(f"warning: {message}", file=sys.stderr)


def display_path(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def collect_files() -> list[tuple[Path, Path]]:
    """回傳 [(相對路徑, 實際路徑)]，已依相對路徑不分大小寫排序。

    source/ 先掃，data/source/ 後掃；因此同相對路徑時 source/ 先佔位、不被覆蓋。
    """
    found: dict[str, tuple[Path, Path]] = {}
    for directory in SOURCE_DIRS:
        if not directory.is_dir():
            continue
        for path in directory.rglob("*"):
            if not path.is_file() or path.suffix.lower() != ".csv":
                continue
            rel = path.relative_to(directory)
            key = rel.as_posix().casefold()
            if key not in found:
                found[key] = (rel, path)
    return [found[key] for key in sorted(found)]


def decode_file(path: Path, reporter: Reporter) -> str | None:
    raw = path.read_bytes()
    for encoding in ENCODINGS:
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    reporter.warn(
        f"{display_path(path)}: cannot decode as any of {', '.join(ENCODINGS)}; skipped"
    )
    return None


def load_existing() -> tuple[dict[tuple[str, str, str], int], int]:
    """讀現有 vocabulary.json → ((批次, a, b) → id, 最大 id)。"""
    if not VOCAB_PATH.is_file():
        return {}, 0
    try:
        data = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"warning: cannot read existing {display_path(VOCAB_PATH)}: {exc}", file=sys.stderr)
        return {}, 0

    existing: dict[tuple[str, str, str], int] = {}
    max_id = 0
    groups = data.get("groups") if isinstance(data, dict) else None
    if not isinstance(groups, dict):
        return {}, 0
    for batch, entries in groups.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            entry_id = entry.get("id")
            a = entry.get("a")
            if not isinstance(entry_id, int) or not isinstance(a, str):
                continue
            b = entry.get("b") if isinstance(entry.get("b"), str) else ""
            key = (str(batch), a, b)
            existing.setdefault(key, entry_id)
            max_id = max(max_id, entry_id)
    return existing, max_id


def normalized_header(cells: list[str]) -> list[str]:
    return [cell.strip().lower() for cell in cells]


def header_index(header: list[str]) -> dict[str, int]:
    """把表頭對應到 a/ch/b/ex/cn/batch/deck/seg/exam/label；重複欄位只取第一個。"""
    index: dict[str, int] = {}
    for position, name in enumerate(header):
        for field, aliases in ALIASES.items():
            if field not in index and name in aliases:
                index[field] = position
                break
    return index


def cell(row: list[str], index: dict[str, int], field: str) -> str:
    position = index.get(field)
    if position is None or position >= len(row):
        return ""
    return row[position].strip()


def parse_positive_int(raw: str) -> int | None:
    text = (raw or "").strip()
    if not text:
        return None
    try:
        value = int(text)
    except ValueError:
        return None
    return value if value >= 1 else None


def parse_filename_level(stem: str, patterns: tuple[re.Pattern, ...]) -> int | None:
    for pattern in patterns:
        match = pattern.search(stem)
        if match:
            value = int(match.group(1))
            if value >= 1:
                return value
    return None


def filename_deck(rel: Path) -> str:
    """檔名／路徑含「上年」→ 上年英語班生字，否則預設本年度課程。"""
    return LEGACY_DECK if "上年" in rel.as_posix() else DEFAULT_DECK


def collect_values(
    rows: list[tuple[int, list[str]]], index: dict[str, int], field: str
) -> tuple[str, bool]:
    """回傳（第一個非空值, 是否有列給出不同值）。"""
    first = ""
    conflict = False
    for _, row in rows:
        value = cell(row, index, field)
        if not value:
            continue
        if not first:
            first = value
        elif value != first:
            conflict = True
    return first, conflict


def collect_level(
    rows: list[tuple[int, list[str]]],
    index: dict[str, int],
    field: str,
    path: Path,
    reporter: Reporter,
) -> tuple[int | None, bool]:
    """收集 seg / exam 整數值；無效值警告一次後忽略。"""
    first: int | None = None
    conflict = False
    warned_invalid = False
    for line_no, row in rows:
        raw = cell(row, index, field)
        if not raw:
            continue
        value = parse_positive_int(raw)
        if value is None:
            if not warned_invalid:
                reporter.warn(
                    f"{display_path(path)}:{line_no}: invalid {field} value {raw!r}; ignored"
                )
                warned_invalid = True
            continue
        if first is None:
            first = value
        elif value != first:
            conflict = True
    return first, conflict


def file_metadata(
    rel: Path,
    path: Path,
    index: dict[str, int],
    rows: list[tuple[int, list[str]]],
    reporter: Reporter,
) -> dict:
    """由欄位 + 檔名算出這一個 CSV（一次大測）的批次 metadata。"""
    deck_cell, deck_conflict = collect_values(rows, index, "deck")
    label_cell, label_conflict = collect_values(rows, index, "label")
    seg_cell, seg_conflict = collect_level(rows, index, "seg", path, reporter)
    exam_cell, exam_conflict = collect_level(rows, index, "exam", path, reporter)

    # 欄位優先，其次檔名
    seg = seg_cell if seg_cell is not None else parse_filename_level(rel.stem, SEG_PATTERNS)
    exam = exam_cell if exam_cell is not None else parse_filename_level(rel.stem, EXAM_PATTERNS)

    if (seg is None) != (exam is None):
        if seg is None:
            seg = 1
            reporter.warn(
                f"{display_path(path)}: only exam given; defaulting seg=1"
            )
        else:
            exam = 1
            reporter.warn(
                f"{display_path(path)}: only seg given; defaulting exam=1"
            )

    deck = deck_cell or filename_deck(rel)

    if deck != LEGACY_DECK and seg is None and exam is None:
        reporter.warn(
            f"{display_path(path)}: deck {deck!r} has no seg/exam; "
            "kept as a batch directly under the deck"
        )

    conflicts = [
        name
        for name, flag in (
            ("deck", deck_conflict),
            ("seg", seg_conflict),
            ("exam", exam_conflict),
            ("label", label_conflict),
        )
        if flag
    ]
    if conflicts:
        reporter.warn(
            f"{display_path(path)}: rows disagree on {', '.join(conflicts)}; "
            "using first non-empty value"
        )

    if label_cell:
        label = label_cell
    elif seg is not None and exam is not None:
        label = f"第{seg}段・第{exam}次大測"
    else:
        label = rel.stem

    meta: dict = {"key": rel.stem, "label": label, "deck": deck}
    if seg is not None:
        meta["seg"] = seg
    if exam is not None:
        meta["exam"] = exam
    return meta


def build(reporter: Reporter) -> tuple[dict[str, list[dict]], dict[str, dict], dict[str, int]]:
    existing, max_id = load_existing()
    next_id = max_id + 1

    groups: dict[str, list[dict]] = {}
    batches: dict[str, dict] = {}
    seen_keys: set[tuple[str, str, str]] = set()
    seen_a: dict[str, set[str]] = {}
    warned_word_pairs: set[tuple[str, str, str]] = set()

    stats = {
        "files": 0,
        "pairs": 0,
        "cards": 0,
        "new_ids": 0,
    }

    for rel, path in collect_files():
        default_batch = rel.stem
        if default_batch in RESERVED_STEMS:
            reporter.warn(
                f"{display_path(path)}: filename stem '{default_batch}' is reserved; skipped"
            )
            continue

        text = decode_file(path, reporter)
        if text is None:
            continue
        stats["files"] += 1

        raw_rows: list[tuple[int, list[str]]] = []
        reader = csv.reader(io.StringIO(text, newline=""))
        for row in reader:
            raw_rows.append((reader.line_num, row))

        header_pos: int | None = None
        for position, (_, row) in enumerate(raw_rows):
            if not row or all(not value.strip() for value in row):
                continue
            if row[0].strip().startswith("#"):
                continue
            header_pos = position
            break

        if header_pos is None:
            reporter.warn(f"{display_path(path)}: no header row; file skipped")
            continue

        header = normalized_header(raw_rows[header_pos][1])
        index = header_index(header)
        missing = [field for field in ("a", "ch") if field not in index]
        if missing:
            names = {
                "a": "word",
                "ch": "chinese",
            }
            reporter.warn(
                f"{display_path(path)}: header missing "
                + ", ".join(names[field] for field in missing)
                + "; file skipped"
            )
            continue

        data_rows = raw_rows[header_pos + 1 :]
        meta = file_metadata(rel, path, index, data_rows, reporter)

        for line_no, row in data_rows:
            if not row or all(not value.strip() for value in row):
                continue
            if row[0].strip().startswith("#"):
                continue

            word = cell(row, index, "a")
            chinese = cell(row, index, "ch")
            if not word or not chinese:
                reporter.warn(
                    f"{display_path(path)}:{line_no}: missing "
                    + ("word" if not word else "chinese")
                    + "; row skipped"
                )
                continue

            batch = cell(row, index, "batch") or default_batch
            synonym = cell(row, index, "b")
            example = cell(row, index, "ex")
            example_cn = cell(row, index, "cn")

            if batch not in batches:
                batch_meta = dict(meta)
                batch_meta["key"] = batch
                # 逐列改 batch 且沒有自訂 label 時，label 跟著新 key
                if batch != default_batch and meta["label"] == rel.stem:
                    batch_meta["label"] = batch
                batches[batch] = batch_meta

            pair_key = (batch, word, synonym)
            if pair_key in seen_keys:
                reporter.warn(
                    f"{display_path(path)}:{line_no}: duplicate pair "
                    f"({word!r}, {synonym!r}) in batch {batch!r}; skipped"
                )
                continue
            seen_keys.add(pair_key)

            entry_id = existing.get(pair_key)
            if entry_id is None:
                entry_id = next_id
                next_id += 1
                stats["new_ids"] += 1

            entry: dict = {"id": entry_id, "a": word}
            if synonym:
                entry["b"] = synonym
            entry["ch"] = chinese
            if example:
                entry["ex"] = example
            if example_cn:
                entry["cn"] = example_cn

            groups.setdefault(batch, []).append(entry)
            stats["pairs"] += 1
            stats["cards"] += 2 if synonym else 1

            # 跨批次重複的 a（同批次不警告）
            previous_batches = seen_a.setdefault(word, set())
            for other in previous_batches:
                if other == batch:
                    continue
                pair = tuple(sorted((other, batch)))
                warning_key = (word, pair[0], pair[1])
                if warning_key not in warned_word_pairs:
                    warned_word_pairs.add(warning_key)
                    reporter.warn(
                        f"duplicate word {word!r} across batches "
                        f"{pair[0]!r} and {pair[1]!r}"
                    )
            previous_batches.add(batch)

            if not example:
                reporter.warn(
                    f"{display_path(path)}:{line_no}: missing example for {word!r}"
                )
            else:
                lowered = example.lower()
                if word.lower() not in lowered and (
                    not synonym or synonym.lower() not in lowered
                ):
                    reporter.warn(
                        f"{display_path(path)}:{line_no}: example for {word!r} "
                        "contains neither a nor b"
                    )

    return groups, batches, stats


def batch_sort_key(batch: dict) -> tuple:
    """非 legacy 牌組在前（deck, seg, exam, key），legacy 牌組最後（依 key）。"""
    key = batch["key"]
    deck = batch["deck"]
    if deck == LEGACY_DECK:
        return (1, "", 0, 0, key)
    return (0, deck, batch.get("seg", 0), batch.get("exam", 0), key)


def ordered_batches(batches: dict[str, dict]) -> list[dict]:
    return sorted(batches.values(), key=batch_sort_key)


def render(batches: list[dict], groups: dict[str, list[dict]]) -> str:
    lines = ["{", '  "batches": [']
    fields = ("key", "label", "deck", "seg", "exam")
    for batch_index, batch in enumerate(batches):
        entry = {field: batch[field] for field in fields if field in batch}
        comma = "," if batch_index < len(batches) - 1 else ""
        lines.append(
            "    " + json.dumps(entry, ensure_ascii=False, separators=(", ", ":")) + comma
        )
    lines.append("  ],")
    lines.append('  "groups": {')
    keys = sorted(groups)
    for group_index, key in enumerate(keys):
        lines.append(f"    {json.dumps(key, ensure_ascii=False)}: [")
        entries = groups[key]
        for entry_index, entry in enumerate(entries):
            comma = "," if entry_index < len(entries) - 1 else ""
            lines.append("      " + json.dumps(entry, ensure_ascii=False, separators=(", ", ":")) + comma)
        comma = "," if group_index < len(keys) - 1 else ""
        lines.append("    ]" + comma)
    lines.append("  }")
    lines.append("}")
    return "\n".join(lines) + "\n"


def normalize_batches(raw) -> list[dict] | None:
    """正規化 batches：只保留 key/label/deck/seg/exam 非空欄位。"""
    if not isinstance(raw, dict):
        return None
    batches = raw.get("batches")
    if not isinstance(batches, list):
        return None

    result: list[dict] = []
    for batch in batches:
        if not isinstance(batch, dict):
            return None
        normalized: dict = {}
        for field in ("key", "label", "deck", "seg", "exam"):
            value = batch.get(field)
            if value not in ("", None):
                normalized[field] = value
        result.append(normalized)
    return result


def normalize_for_compare(raw) -> dict[str, list[dict]] | None:
    """把 JSON 內容正規化：忽略空字串欄位、只比對語意欄位。"""
    if not isinstance(raw, dict):
        return None
    groups = raw.get("groups")
    if not isinstance(groups, dict):
        return None

    result: dict[str, list[dict]] = {}
    for key, entries in groups.items():
        if not isinstance(entries, list):
            return None
        normalized_entries: list[dict] = []
        for entry in entries:
            if not isinstance(entry, dict):
                return None
            normalized: dict = {}
            for field in ("id", "a", "b", "ch", "ex", "cn"):
                value = entry.get(field)
                if value not in ("", None):
                    normalized[field] = value
            normalized_entries.append(normalized)
        result[str(key)] = normalized_entries
    return result


def current_content() -> tuple[list[dict] | None, dict[str, list[dict]] | None] | None:
    if not VOCAB_PATH.is_file():
        return None
    try:
        raw = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return normalize_batches(raw), normalize_for_compare(raw)


def parse_show(value: str) -> int:
    if value.strip().lower() == "all":
        return -1
    try:
        number = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("must be a non-negative integer or 'all'") from exc
    if number < 0:
        raise argparse.ArgumentTypeError("must be a non-negative integer or 'all'")
    return number


def print_show(batches: dict[str, dict], groups: dict[str, list[dict]], limit: int) -> None:
    shown = 0
    for batch in sorted(groups):
        info = batches.get(batch)
        tag = ""
        if info:
            level = (
                f" seg{info['seg']}/exam{info['exam']}" if "seg" in info else ""
            )
            tag = f"[{info['deck']}{level}] "
        for entry in groups[batch]:
            if limit >= 0 and shown >= limit:
                return
            print(f"{batch}  {tag}{json.dumps(entry, ensure_ascii=False)}")
            shown += 1


def print_summary(stats: dict[str, int], warnings: int) -> None:
    print(f"files read: {stats['files']}")
    print(f"pairs: {stats['pairs']}")
    print(f"cards: {stats['cards']}")
    print(f"new ids assigned: {stats['new_ids']}")
    print(f"warnings: {warnings}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Build vocabulary.json from source/ and data/source/ CSV files."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="build in memory and compare with the current vocabulary.json; never write",
    )
    parser.add_argument(
        "--show",
        metavar="N",
        type=parse_show,
        help="print the first N pair entries (or 'all')",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="exit 1 when warnings were produced",
    )
    args = parser.parse_args(argv)

    reporter = Reporter()

    # 沒有任何 CSV 時不要覆蓋現有資料（避免手滑清空）
    if not collect_files():
        print(
            "error: no CSV files found in source/ or data/source/; nothing written",
            file=sys.stderr,
        )
        return 2

    groups, batches, stats = build(reporter)
    batch_list = ordered_batches(batches)

    if args.show is not None:
        print_show(batches, groups, args.show)

    rendered = {"batches": batch_list, "groups": groups}
    rendered_batches = normalize_batches(rendered)
    rendered_groups = normalize_for_compare(rendered)
    current = current_content()

    if args.check:
        same = (
            current is not None
            and rendered_batches == current[0]
            and rendered_groups == current[1]
        )
        if same:
            print("OK")
            result = 0
        else:
            print("DIFFERS")
            result = 1
        print_summary(stats, reporter.count)
        if result == 1:
            return 1
        return 1 if args.strict and reporter.count else 0

    VOCAB_PATH.write_text(render(batch_list, groups), encoding="utf-8", newline="\n")
    print_summary(stats, reporter.count)
    if args.strict and reporter.count:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
