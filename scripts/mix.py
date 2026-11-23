"""scenesin - Zero-Dependency Procedural SFX & Audio Mixer
Mixes data/narration.wav + synchronized procedural SFX (whoosh, pop, tock, slam, sparkle)
into data/mix.wav (24 kHz mono/stereo PCM) using only Python standard library.
Author: Anouar Zeklat (@anouar.co | youtube/@anouarzeklat)

Usage:
  python scripts/mix.py <project>
"""

import json
import math
import random
import struct
import sys
import wave
from pathlib import Path

SR = 24000


def gen_whoosh(dur=0.28):
    n = int(dur * SR)
    out = [0.0] * n
    lp = 0.0
    rng = random.Random(42)
    for i in range(n):
        p = i / max(1, n - 1)
        env = math.sin(math.pi * p) ** 1.8
        alpha = 0.05 + 0.25 * math.sin(math.pi * p)
        white = rng.uniform(-1.0, 1.0)
        lp = lp + alpha * (white - lp)
        out[i] = lp * env * 0.55
    return out


def gen_pop(dur=0.14):
    n = int(dur * SR)
    out = [0.0] * n
    phase = 0.0
    for i in range(n):
        t = i / SR
        p = i / max(1, n - 1)
        freq = 280.0 + 520.0 * math.exp(-t * 32.0)
        phase += 2.0 * math.pi * freq / SR
        env = math.sin(min(1.0, p * 8.0) * math.pi * 0.5) * math.exp(-t * 28.0)
        out[i] = math.sin(phase) * env * 0.65
    return out


def gen_tock(dur=0.07):
    n = int(dur * SR)
    out = [0.0] * n
    phase = 0.0
    for i in range(n):
        t = i / SR
        freq = 900.0 * math.exp(-t * 40.0) + 220.0
        phase += 2.0 * math.pi * freq / SR
        env = math.exp(-t * 65.0)
        out[i] = math.sin(phase) * env * 0.50
    return out


def gen_slam(dur=0.35):
    n = int(dur * SR)
    out = [0.0] * n
    phase = 0.0
    rng = random.Random(7)
    lp = 0.0
    for i in range(n):
        t = i / SR
        freq = 130.0 * math.exp(-t * 14.0) + 42.0
        phase += 2.0 * math.pi * freq / SR
        thud = math.sin(phase) * math.exp(-t * 10.0)
        lp = lp + 0.12 * (rng.uniform(-1.0, 1.0) - lp)
        impact = lp * math.exp(-t * 24.0) * 0.45
        out[i] = (thud * 0.75 + impact) * 0.7
    return out


def gen_sparkle(dur=0.26):
    n = int(dur * SR)
    out = [0.0] * n
    freqs = [1046.5, 1318.5, 1568.0, 2093.0]
    for i in range(n):
        t = i / SR
        s = 0.0
        for k, f in enumerate(freqs):
            dt = t - k * 0.035
            if dt > 0:
                s += math.sin(2.0 * math.pi * f * dt) * math.exp(-dt * 20.0) * 0.22
        out[i] = s
    return out


SFX_MAP = {
    'whoosh': gen_whoosh,
    'slide': gen_whoosh,
    'pop': gen_pop,
    'tock': gen_tock,
    'slam': gen_slam,
    'thud': gen_slam,
    'sparkle': gen_sparkle,
}


def main():
    proj = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    script = json.loads((proj / 'script.json').read_text(encoding='utf-8'))
    cues_path = proj / 'data' / 'cues.json'
    lines_path = proj / 'data' / 'lines.json'

    if cues_path.exists():
        cj = json.loads(cues_path.read_text(encoding='utf-8'))
        dur = float(cj['duration'])
        cues = cj.get('cues', [])
    else:
        dur = float(json.loads(lines_path.read_text(encoding='utf-8'))['duration'])
        cues = []

    total_samples = int(dur * SR) + SR // 10
    mix = [0.0] * total_samples

    # 1. Load narration.wav if present
    narr_path = proj / 'data' / 'narration.wav'
    if narr_path.exists() and script.get('voiceover', True) is not False:
        with wave.open(str(narr_path), 'rb') as wf:
            raw = wf.readframes(wf.getnframes())
            n_samp = len(raw) // 2
            samples = struct.unpack(f'<{n_samp}h', raw)
            limit = min(total_samples, n_samp)
            for i in range(limit):
                mix[i] += (samples[i] / 32768.0) * 0.92

    # 2. Mix procedural SFX if enabled
    if script.get('sfx', True) is not False and cues:
        cache = {}
        for c in cues:
            ctype = c.get('type', 'pop')
            fn = SFX_MAP.get(ctype, gen_pop)
            if ctype not in cache:
                cache[ctype] = fn()
            buf = cache[ctype]
            gain = float(c.get('gain', 0.5)) * 0.65
            start_idx = max(0, int(float(c.get('at', 0.0)) * SR))
            end_idx = min(total_samples, start_idx + len(buf))
            for i in range(start_idx, end_idx):
                mix[i] += buf[i - start_idx] * gain

    # 3. Soft clip & write 16-bit PCM WAV
    out_path = proj / 'data' / 'mix.wav'
    pcm = bytearray(total_samples * 2)
    for i, v in enumerate(mix):
        # Soft tanh limiter
        v = math.tanh(v)
        iv = max(-32767, min(32767, int(v * 32000)))
        struct.pack_into('<h', pcm, i * 2, iv)

    with wave.open(str(out_path), 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(bytes(pcm))

    print(f"Mixed audio saved: {out_path} ({dur:.2f}s, {len(cues)} SFX cues, music={script.get('music', 'none')})")


if __name__ == '__main__':
    main()

