#!/usr/bin/env python3
"""Convert your copy of the ASD-STE100 specification into ste-dictionary.json.

The app includes a verified selection of about 300 non-STE words. To use the
full dictionary, convert your own copy of the specification (free from
https://www.asd-ste100.org) with this script, and put the output file next
to index.html. The app loads it at startup.

The output contains only the words that are not approved in any part of
speech, with their approved alternatives. It does not contain definitions or
examples. The specification is (c) ASD. Its copyright notice does not permit
reproduction or publication without written authority, except for the
organizations that it lists. Thus, do not commit the output file to a public
repository (it is in .gitignore), and use it only as your organization's
rights permit.

Usage:
    python3 tools/import_ste_dictionary.py ASD-STE100_ISSUE9.pdf
    python3 tools/import_ste_dictionary.py spec.txt -o ste-dictionary.json

Converting a PDF needs the pdftotext program (poppler-utils). You can also
convert the PDF yourself with "pdftotext -layout" and give the .txt file.
The script was tested with Issue 9 (2025-01-15).
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys

POS = r"(?:n|v|adj|adv|prep|conj|pron|art|TN|TV)"
HEAD = re.compile(r"^(\S[^()]*?)\s*\((" + POS + r")\),?(?:\s{2,}(.*))?$")
# An approved alternative in column 2, for example "MAKE SURE (v)".
ALT = re.compile(r"([A-Z][A-Z0-9'\-…. ]*?[A-Z0-9])\s*\((" + POS + r")\)")
# A long headword whose part of speech wraps to the next line.
WRAPPED_HEAD = re.compile(r"^([a-z][a-z \-/']*?)\s{2,}(\S.*)$")
WRAPPED_POS = re.compile(r"^\((" + POS + r")\)")


def read_text(path):
    if path.lower().endswith(".pdf"):
        if not shutil.which("pdftotext"):
            sys.exit("pdftotext is not installed. Install poppler-utils, or convert the PDF to text with 'pdftotext -layout'.")
        out = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True, check=True)
        return out.stdout
    with open(path, encoding="utf-8") as f:
        return f.read()


def detect_source(text):
    # Page footers: "Issue 9 ... Page 2-0-1" with the date on the next line.
    issue = re.search(r"Issue\s+(\d+)[^\n]*\n\s*(\d{4}-\d{2}-\d{2})", text)
    if issue:
        return f"ASD-STE100 Issue {issue.group(1)} ({issue.group(2)})"
    issue = re.search(r"Issue\s+(\d+)", text)
    return f"ASD-STE100 Issue {issue.group(1)}" if issue else "ASD-STE100"


def parse(text):
    lines = text.split("\n")
    # The dictionary starts at page 2-0-1 and ends before part 3 (if any).
    start = next((i for i, ln in enumerate(lines) if "Part 2 - Dictionary" in ln and "Page 2-0-1" in ln), None)
    if start is None:
        sys.exit("Cannot find the dictionary (Part 2). Is this the ASD-STE100 specification, converted with 'pdftotext -layout'?")
    entries, forms = [], set()
    cur = None
    for i in range(start, len(lines)):
        ln = lines[i]
        if re.match(r"^\s*Page 3-", ln):
            break
        head = HEAD.match(ln)
        wrapped = None
        if not head:
            w = WRAPPED_HEAD.match(ln)
            nxt = WRAPPED_POS.match(lines[i + 1]) if i + 1 < len(lines) else None
            if w and nxt:
                wrapped = (w.group(1).strip(), nxt.group(1), w.group(2))
        if head or wrapped:
            if head:
                word, pos, rest = head.group(1).strip(), head.group(2), head.group(3) or ""
                # "according to       REFER (v)": the alternative was read as part of the word.
                if re.search(r"\s{2,}", word):
                    word, rest = re.split(r"\s{2,}", word, maxsplit=1)[0], ""
                    nxt = WRAPPED_POS.match(lines[i + 1]) if i + 1 < len(lines) else None
                    if nxt:
                        pos = nxt.group(1)
                    rest = ln[len(word):].strip()
            else:
                word, pos, rest = wrapped
            approved = word == word.upper() and any(c.isalpha() for c in word)
            cur = {"word": word, "pos": pos, "approved": approved, "alts": []}
            entries.append(cur)
            if approved:
                forms.add(word.lower())
            else:
                col2 = re.split(r"\s{2,}", rest.strip())[0] if rest.strip() else ""
                a = ALT.match(col2)
                if a:
                    cur["alts"].append(a.group(1))
                elif col2 and col2 == col2.upper() and re.search(r"[A-Z]", col2):
                    cur["alts"].append(col2)
            continue
        if cur is None:
            continue
        if cur["approved"]:
            # Inflection lines under an approved verb or adjective: "IS, WAS," or "(also ARE, WERE)".
            if ln[:1] not in (" ", ""):
                c1 = re.split(r"\s{2,}", ln.strip())[0].replace("(also", "").replace(")", "")
                for part in c1.split(","):
                    part = part.strip()
                    if part and re.fullmatch(r"[A-Z][A-Z\-' ]*", part):
                        forms.add(part.lower())
        else:
            lead = len(ln) - len(ln.lstrip())
            if 10 <= lead <= 30:
                col2 = re.split(r"\s{2,}", ln.strip())[0]
                a = ALT.match(col2)
                if a:
                    cur["alts"].append(a.group(1))
                elif re.fullmatch(r"[A-Z][A-Z'\-…. ]*[A-Z.]", col2) and len(col2) > 2:
                    # An alternative without a part of speech, for example "CAREFULLY MOVE".
                    cur["alts"].append(col2)
    return entries, forms


def inflections(word):
    if not re.fullmatch(r"[a-z]+", word):
        return []
    out = [word + "s", word + "es", word + "d", word + "ed", word + "ing"]
    if word.endswith("e"):
        out += [word[:-1] + "ing", word[:-1] + "ed"]
    if word.endswith("y"):
        out += [word[:-1] + "ies", word[:-1] + "ied"]
    return out


def build(entries, forms):
    by_word = {}
    for e in entries:
        if e["approved"]:
            continue
        w = e["word"].lower()
        item = by_word.setdefault(w, {"word": w, "pos": [], "alternatives": []})
        if e["pos"] not in item["pos"]:
            item["pos"].append(e["pos"])
        for a in e["alts"]:
            a = re.sub(r"\s+", " ", a).strip().lower()
            if a not in item["alternatives"]:
                item["alternatives"].append(a)
    out = []
    for w, item in sorted(by_word.items()):
        # Leave out words that are approved in another part of speech (for
        # example "check"): the checker cannot identify parts of speech.
        if w in forms:
            continue
        if not item["alternatives"]:
            item["alternatives"] = ["(use a different construction; see the specification)"]
        exc = [f for f in inflections(w) if f in forms]
        if exc:
            item["except"] = exc
        out.append(item)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", help="ASD-STE100 PDF, or a text file made with 'pdftotext -layout'")
    ap.add_argument("-o", "--output", default="ste-dictionary.json")
    args = ap.parse_args()
    text = read_text(args.source)
    entries, forms = parse(text)
    words = build(entries, forms)
    approved = sum(1 for e in entries if e["approved"])
    if len(words) < int(os.environ.get("STE_IMPORT_MIN_WORDS", "100")):
        sys.exit(f"Only {len(words)} words found. The file format is not as expected.")
    data = {"format": "ste-coach-dictionary", "version": 1, "source": detect_source(text), "entries": words}
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{data['source']}: {approved} approved entries, {len(words)} words that are not approved in any part of speech.")
    print(f"Wrote {args.output}. Put it next to index.html. Do not publish it.")


if __name__ == "__main__":
    main()
