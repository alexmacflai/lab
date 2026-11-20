#!/usr/bin/env python3
"""Serve the lab locally and save receipt tuning to its fixed settings module."""
import argparse
import json
import math
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / 'prototypes/receipt-portrait/dev/settings.js'
LIMITS = {
    'image': {'resolution': (48, 288), 'gamma': (.5, 2.5), 'brightness': (0, 1),
              'aspect': (2 / 3, 16 / 9), 'size': (.25, 2)},
    'timing': {'fps': (4, 18), 'delay': (0, 1500), 'jitter': (0, 2)},
}


def validate_section(section, values):
    assert isinstance(values, dict) and values.keys() == LIMITS[section].keys()
    for key, (low, high) in LIMITS[section].items():
        value = values[key]
        assert type(value) in (float, int) and math.isfinite(value) and low <= value <= high


def validate(data):
    assert isinstance(data, dict) and set(data) == {'global', 'variants'}
    assert set(data['global']) == set(LIMITS)
    for section in LIMITS:
        validate_section(section, data['global'][section])
    assert isinstance(data['variants'], dict) and len(data['variants']) <= 1000
    for key, variant in data['variants'].items():
        assert key in {'receipts', 'library-cards', 'notebook-scraps'}
        assert isinstance(variant, dict) and set(variant) <= set(LIMITS)
        for section, override in variant.items():
            assert set(override) == {'enabled', 'values'}
            assert isinstance(override['enabled'], dict) and set(override['enabled']) <= set(LIMITS[section])
            assert all(type(enabled) is bool for enabled in override['enabled'].values())
            validate_section(section, override['values'])


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        origin, host = self.headers.get('Origin'), self.headers.get('Host')
        local_hosts = {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}
        if self.path != '/__receipt-settings' or host not in local_hosts or origin != f'http://{host}':
            self.send_error(403)
            return
        try:
            length = int(self.headers.get('Content-Length', 0))
            assert 0 < length <= 262144
            data = json.loads(self.rfile.read(length))
            validate(data)
        except (ValueError, AssertionError, TypeError, KeyError, AttributeError):
            self.send_error(400, 'Invalid receipt settings')
            return
        source = '// Saved by the local development server. Camera images are never included.\n'
        source += 'export const SETTINGS = ' + json.dumps(data, indent=2, allow_nan=False) + ';\n'
        try:
            temporary = TARGET.with_suffix('.tmp')
            temporary.write_text(source)
            temporary.replace(TARGET)
        except OSError:
            self.send_error(500, 'Could not write settings')
            return
        self.send_response(204)
        self.end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8082)
    args = parser.parse_args()
    print(f'http://127.0.0.1:{args.port}/prototypes/receipt-portrait/dev/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
