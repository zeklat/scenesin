#!/usr/bin/env python3
"""scenesin - Python CLI Runner
Created by Anouar Zeklat (Instagram: @anouar.co)
Explainer videos from code and script.
"""

import os
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def main():
    args = sys.argv[1:]
    node_script = ROOT / 'bin' / 'scenesin.mjs'
    
    # Run Node CLI runner
    cmd = ['node', str(node_script)] + args
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except FileNotFoundError:
        print("Error: Node.js is required to run the scenesin visual engine. Download at nodejs.org")
        sys.exit(1)

if __name__ == '__main__':
    main()
