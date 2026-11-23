"""scenesin - Manim Community Bridge (3Blue1Brown-style Math & Science Animations)
Renders a Manim scene directly at 9:16 (1080x1920) or 16:9 (1920x1080) 30fps MP4
so it can be composited or used directly in scenesin projects.
Author: Anouar Zeklat (@anouar.co | https://www.youtube.com/@anouarzeklat)

Install (optional): pip install manim

Usage:
  python scripts/manim_bridge.py <scene_file.py> <SceneClass> --format 9:16 --out output/my-proj/renders/manim.mp4
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Render a Manim scene in scenesin 9:16 or 16:9 format")
    parser.add_argument('file', help='Path to Python file containing the Manim Scene class')
    parser.add_argument('scene', help='Name of the Scene class to render')
    parser.add_argument('--format', choices=['9:16', '16:9'], default='9:16', help='Aspect ratio')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second (default: 30)')
    parser.add_argument('--out', help='Optional output MP4 path')
    args = parser.parse_args()

    if not shutil.which('manim'):
        print("Manim is not installed yet. Install it free (MIT) with:")
        print("  pip install manim")
        sys.exit(1)

    res = '1080,1920' if args.format == '9:16' else '1920,1080'
    cmd = ['manim', '-r', res, '--fps', str(args.fps), args.file, args.scene]
    if args.out:
        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        cmd.extend(['-o', str(out_path)])

    print(f"Running Manim ({args.format} @ {args.fps}fps): {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


if __name__ == '__main__':
    main()
