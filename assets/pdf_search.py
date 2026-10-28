#!/usr/bin/env python3
"""Full-text search for the DSH PDF reader, backed by pypdf."""
from __future__ import annotations

import argparse
import json
import re
import sys


def snippet(text: str, index: int, length: int) -> str:
    start = max(0, index - 80)
    end = min(len(text), index + length + 120)
    value = re.sub(r"\s+", " ", text[start:end]).strip()
    return ("…" if start else "") + value + ("…" if end < len(text) else "")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--query", required=True)
    parser.add_argument("--limit", type=int, default=500)
    args = parser.parse_args()

    query = args.query.strip()
    if not query:
        print(json.dumps({"ok": False, "error": "empty query"}))
        return 2

    try:
        from pypdf import PdfReader

        reader = PdfReader(args.file)
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                pass
        pages = len(reader.pages)
        needle = query.casefold()
        matches = []
        truncated = False
        for number, page in enumerate(reader.pages, 1):
            try:
                text = page.extract_text() or ""
            except Exception:
                text = ""
            if not text:
                continue
            folded = text.casefold()
            start = 0
            occurrence = 0
            while True:
                found = folded.find(needle, start)
                if found < 0:
                    break
                matches.append({
                    "page": number,
                    "occurrence": occurrence,
                    "snippet": snippet(text, found, len(needle)),
                })
                occurrence += 1
                if len(matches) >= args.limit:
                    truncated = True
                    break
                start = found + max(1, len(needle))
            if truncated:
                break
        print(json.dumps({
            "ok": True,
            "pages": pages,
            "matches": matches,
            "truncated": truncated,
        }, ensure_ascii=False))
        return 0
    except Exception as error:
        print(json.dumps({"ok": False, "error": str(error)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    sys.exit(main())
