#!/usr/bin/env python3
"""Validate and publish a reviewed PDF, preserving its layout and career claims.

The editable master is maintained separately; only its reviewed PDF is public.
Usage: python scripts/generate-public-resume.py --source /path/to/reviewed.pdf
"""
import argparse
import re
from pathlib import Path
from shutil import copyfile
from pypdf import PdfReader


CLIENT_NAMES = ['gendio', 'stan wootton', 'stan-wootton', 'locksmith', 'upzy']


def names_client(value: str) -> bool:
    lowered = value.lower()
    return any(name in lowered for name in CLIENT_NAMES) or re.search(r'\bswl\b', lowered) is not None


def publish_resume(source: Path, output: Path) -> None:
    reader = PdfReader(source)
    if len(reader.pages) != 2:
        raise ValueError('The reviewed general resume must contain two pages.')
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    required = ['Sajeevan Veeriah', 'Voltwyn', 'JAG Process Solutions',
                'Ford Motor Company via Invenio',
                'SPC-001', 'Deakin University', 'sv.sajeevanveeriah.workers.dev']
    missing = [value for value in required if value not in text]
    if missing:
        raise ValueError(f'Missing expected resume content: {missing}')
    forbidden = ['sajeevanveeriah.github.io', 'CONTRACT PENDING', '\u2013', '\u2014']
    if any(value in text for value in forbidden):
        raise ValueError('Stale domain, appointment claim or unsupported punctuation found.')
    links = [str(ref.get_object().get('/A', {}).get('/URI', ''))
             for page in reader.pages for ref in page.get('/Annots', [])]
    # Client work is published anonymously; a resume that names a client, in its
    # text or in a link target, must not ship.
    if names_client(text) or any(names_client(url) for url in links):
        raise ValueError('A client name was found; publish only the anonymised resume.')
    if not any(url.rstrip('/') == 'https://sv.sajeevanveeriah.workers.dev' for url in links):
        raise ValueError('The portfolio hyperlink is missing or outdated.')
    if any('sajeevanveeriah.github.io' in url for url in links):
        raise ValueError('An old portfolio hyperlink remains.')
    output.parent.mkdir(parents=True, exist_ok=True)
    if source.resolve() != output.resolve():
        copyfile(source, output)
    print(f'Validated two-page resume: {output}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--output', type=Path,
                        default=Path('public/assets/Resume_Sajeevan_Veeriah.pdf'))
    args = parser.parse_args()
    publish_resume(args.source, args.output)


if __name__ == '__main__':
    main()
