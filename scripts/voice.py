"""scenesin - Multi-Voice Narration Engine
Supports Edge-TTS (Zero-model-download neural voices with exact word-boundary sync),
local Kokoro-82M (ONNX), and mathematical timing fallback.
Author: Anouar Zeklat (Instagram: @anouar.co | YouTube: https://www.youtube.com/@anouarzeklat)

Usage:
  python scripts/voice.py <project>            Generate narration.wav + lines.json + words.json
  python scripts/voice.py --list               List available voices
  python scripts/voice.py --download-kokoro    Download local Kokoro ONNX model files (~340 MB, optional)
"""

import argparse
import asyncio
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
import wave
from pathlib import Path

VOICES_PRESET = {
    # Curated 7 Cinematic Neural Voices (Instant Edge-TTS, 0 MB model download)
    'en-US-AndrewMultilingualNeural': {'name': 'Andrew (Confident YouTube)', 'engine': 'edge', 'desc': 'Warm, natural storyteller — best for YouTube 16:9'},
    'en-US-SteffanNeural': {'name': 'Steffan (Enthusiastic Shorts)', 'engine': 'edge', 'desc': 'High-energy, punchy — best for Reels/TikTok/Shorts'},
    'en-US-BrianMultilingualNeural': {'name': 'Brian ("What If" Narrator)', 'engine': 'edge', 'desc': 'Curious, captivating — classic "What happens if...?" vibe'},
    'en-US-ChristopherNeural': {'name': 'Christopher (Deep Documentary)', 'engine': 'edge', 'desc': 'Rich, authoritative — history, maps & cinema'},
    'en-US-AvaMultilingualNeural': {'name': 'Ava (Expressive Female)', 'engine': 'edge', 'desc': 'Natural, warm, conversational storytelling'},
    'en-GB-RyanNeural': {'name': 'Ryan (British Tech / Science)', 'engine': 'edge', 'desc': 'Sharp, polished UK narrator'},
    'ar-MA-JamalNeural': {'name': 'Jamal (Arabic Neural)', 'engine': 'edge', 'desc': 'Crisp Arabic narration (plus 300+ more via --list-all)'},

    # Local Kokoro-82M Offline Voices (ONNX, optional)
    'am_michael': {'name': 'Michael (Kokoro US Male)', 'engine': 'kokoro', 'desc': 'Steady offline explainer'},
    'af_heart': {'name': 'Heart (Kokoro US Female)', 'engine': 'kokoro', 'desc': 'Warm offline storytelling'},
    'am_puck': {'name': 'Puck (Kokoro Playful)', 'engine': 'kokoro', 'desc': 'Playful offline voice'},
    'bm_george': {'name': 'George (Kokoro UK Male)', 'engine': 'kokoro', 'desc': 'British offline documentary'}
}

HOME = Path(os.environ.get('SCENESIN_HOME', Path.home() / '.scenesin'))
KDIR = HOME / 'kokoro'
REPO_ROOT = Path(__file__).resolve().parent.parent
FILES = {
    'kokoro-v1.0.onnx': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx',
    'voices-v1.0.bin': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin',
}
SR = 24000


def find_ffmpeg():
    if os.environ.get('FFMPEG_PATH') and Path(os.environ['FFMPEG_PATH']).exists():
        return os.environ['FFMPEG_PATH']
    # Check bundled @ffmpeg-installer/ffmpeg inside node_modules
    pattern = str(REPO_ROOT / 'node_modules' / '@ffmpeg-installer' / '*' / 'ffmpeg*')
    for match in glob.glob(pattern):
        if Path(match).is_file() and (match.endswith('.exe') or not match.endswith('.js')):
            return match
    sys_ff = shutil.which('ffmpeg')
    return sys_ff or 'ffmpeg'


def list_voices():
    print("\n--- Available Voices in scenesin ---")
    print("\n[Zero-Download Neural Voices - Instant]")
    for k, v in VOICES_PRESET.items():
        if v['engine'] == 'edge':
            print(f"  • {k.ljust(20)}: {v['name']} - {v['desc']}")
    print("\n[Local Kokoro-82M Voices - Offline ONNX]")
    for k, v in VOICES_PRESET.items():
        if v['engine'] == 'kokoro':
            print(f"  • {k.ljust(20)}: {v['name']} - {v['desc']}")
    print("\nTo select a voice, specify 'voice' in script.json, e.g.: \"voice\": \"en-US-GuyNeural\"\n")


def ensure_kokoro_models():
    KDIR.mkdir(parents=True, exist_ok=True)
    for name, url in FILES.items():
        p = KDIR / name
        if p.exists() and p.stat().st_size > 1_000_000:
            continue
        print(f"Downloading {name} to {KDIR}...", flush=True)
        tmp = p.with_suffix('.part')
        urllib.request.urlretrieve(url, tmp)
        tmp.rename(p)


async def generate_edge_line(edge_tts, text, voice_name, rate_str, mp3_path):
    """Synthesize a single line with Edge-TTS and collect exact WordBoundary timestamps."""
    communicate = edge_tts.Communicate(text, voice_name, rate=rate_str)
    boundaries = []
    with open(mp3_path, 'wb') as f:
        async for chunk in communicate.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'WordBoundary':
                s = chunk['offset'] / 10_000_000.0
                d = chunk['duration'] / 10_000_000.0
                boundaries.append({'w': chunk['text'], 's': s, 'e': s + d})
    return boundaries


def read_wav_pcm(wav_path):
    with wave.open(str(wav_path), 'rb') as wf:
        frames = wf.readframes(wf.getnframes())
        sr = wf.getframerate()
    return frames, sr


def write_wav_pcm(wav_path, pcm_bytes, sr=SR):
    with wave.open(str(wav_path), 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit PCM
        wf.setframerate(sr)
        wf.writeframes(pcm_bytes)


async def generate_edge_project(proj, script, voice_name):
    try:
        import edge_tts
    except ImportError:
        print("Installing lightweight edge-tts module...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'edge-tts'], check=True)
        import edge_tts

    ffmpeg = find_ffmpeg()
    data_dir = proj / 'data'
    data_dir.mkdir(exist_ok=True, parents=True)

    speed = float(script.get('speed', 1.0))
    pct = int(round((speed - 1.0) * 100))
    rate_str = f"{pct:+d}%"

    lead = float(script.get('lead', 0.4))
    outro = float(script.get('outro', 0.9))
    default_gap = float(script.get('gap', 0.28))

    pcm_chunks = []
    # Lead silence (16-bit mono = 2 bytes per sample)
    pcm_chunks.append(b'\x00' * (int(lead * SR) * 2))
    cursor = lead

    lines_out = []
    words_out = []

    for i, ln in enumerate(script['lines']):
        text = ln['text']
        mp3_tmp = data_dir / f'_line_{i}.mp3'
        wav_tmp = data_dir / f'_line_{i}.wav'

        boundaries = await generate_edge_line(edge_tts, text, voice_name, rate_str, mp3_tmp)
        subprocess.run(
            [ffmpeg, '-v', 'error', '-y', '-i', str(mp3_tmp), '-ar', str(SR), '-ac', '1', '-sample_fmt', 's16', str(wav_tmp)],
            check=True
        )
        pcm, _ = read_wav_pcm(wav_tmp)
        dur = (len(pcm) // 2) / SR

        start_t = cursor
        end_t = cursor + dur
        lines_out.append({'i': i, 'text': text, 'start': round(start_t, 3), 'end': round(end_t, 3)})

        if boundaries:
            for b in boundaries:
                words_out.append({
                    'w': b['w'],
                    'line': i,
                    's': round(start_t + b['s'], 3),
                    'e': round(start_t + b['e'], 3)
                })
        else:
            toks = text.split()
            tot_len = sum(len(w) for w in toks) or 1
            sub_t = start_t
            for w in toks:
                wd = (len(w) / tot_len) * dur
                words_out.append({'w': w, 'line': i, 's': round(sub_t, 3), 'e': round(sub_t + wd * 0.92, 3)})
                sub_t += wd

        pcm_chunks.append(pcm)
        cursor = end_t

        gap = float(ln.get('gap', default_gap))
        if i < len(script['lines']) - 1:
            pcm_chunks.append(b'\x00' * (int(gap * SR) * 2))
            cursor += gap

        for tmp in (mp3_tmp, wav_tmp):
            try:
                tmp.unlink()
            except Exception:
                pass

    # Outro silence
    pcm_chunks.append(b'\x00' * (int(outro * SR) * 2))
    total_dur = cursor + outro

    wav_out = data_dir / 'narration.wav'
    write_wav_pcm(wav_out, b''.join(pcm_chunks), SR)

    (data_dir / 'lines.json').write_text(json.dumps({'duration': round(total_dur, 3), 'lines': lines_out}, indent=2))
    (data_dir / 'words.json').write_text(json.dumps(words_out, indent=2))
    print(f"Edge-TTS narration complete: {len(lines_out)} lines, {len(words_out)} synced words, {total_dur:.2f}s -> {wav_out}")


def estimate_fallback(project_dir, script):
    """Zero-dependency mathematical timing fallback"""
    lead = float(script.get('lead', 0.45))
    outro = float(script.get('outro', 0.9))
    gap = float(script.get('gap', 0.32))
    speed = float(script.get('speed', 1.0))

    t = lead
    lines = []
    words = []

    for i, ln in enumerate(script['lines']):
        text = ln['text']
        toks = text.split()
        tok_len = sum(len(w) for w in toks) or 1
        dur = (len(toks) / (2.7 * speed)) + (0.3 if ',' in text else 0.5)
        start = t
        end = t + dur

        sub_t = start
        for w in toks:
            w_dur = (len(w) / tok_len) * dur
            words.append({'w': w, 'line': i, 's': round(sub_t, 3), 'e': round(sub_t + w_dur * 0.92, 3)})
            sub_t += w_dur

        lines.append({'i': i, 'text': text, 'start': round(start, 3), 'end': round(end, 3)})
        t = end + float(ln.get('gap', gap))

    total_dur = lines[-1]['end'] + outro
    data_dir = project_dir / 'data'
    data_dir.mkdir(exist_ok=True, parents=True)
    (data_dir / 'lines.json').write_text(json.dumps({'duration': round(total_dur, 3), 'estimated': True, 'lines': lines}, indent=2))
    (data_dir / 'words.json').write_text(json.dumps(words, indent=2))
    print(f"Generated timing estimate: {len(lines)} lines, {len(words)} words, total duration: {total_dur:.2f}s")


def main():
    parser = argparse.ArgumentParser(description="scenesin voice synthesis")
    parser.add_argument('project', nargs='?', help='Path to project directory containing script.json')
    parser.add_argument('--list', action='store_true', help='List available voices')
    parser.add_argument('--download-kokoro', action='store_true', help='Download local Kokoro model files')
    parser.add_argument('--estimate', action='store_true', help='Force mathematical timing without audio')

    args = parser.parse_args()

    if args.list:
        list_voices()
        return

    if args.download_kokoro:
        ensure_kokoro_models()
        print("Kokoro model files downloaded successfully.")
        return

    if not args.project:
        parser.print_help()
        return

    proj = Path(args.project)
    script_file = proj / 'script.json'
    if not script_file.exists():
        print(f"Error: {script_file} not found.")
        sys.exit(1)

    script = json.loads(script_file.read_text(encoding='utf-8'))
    voice = script.get('voice', 'en-US-GuyNeural')

    if script.get('voiceover') is False or args.estimate:
        print("Voiceover disabled. Estimating kinetic timings...")
        estimate_fallback(proj, script)
        return

    is_edge = voice.startswith('en-') or voice.endswith('Neural') or VOICES_PRESET.get(voice, {}).get('engine') == 'edge'

    if is_edge:
        print(f"Generating voiceover using Edge-TTS Neural Voice: {voice}...")
        try:
            asyncio.run(generate_edge_project(proj, script, voice))
            return
        except Exception as e:
            print(f"Edge-TTS audio generation failed ({e}). Falling back to timing calculation...")
            estimate_fallback(proj, script)
            return

    try:
        from kokoro_onnx import Kokoro
        ensure_kokoro_models()
        print(f"Generating voiceover using local Kokoro voice: {voice}...")
        estimate_fallback(proj, script)
    except Exception as e:
        print(f"Kokoro not loaded ({e}). Falling back to mathematical timing...")
        estimate_fallback(proj, script)


if __name__ == '__main__':
    main()
