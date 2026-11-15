#!/usr/bin/env python3
"""Build one full-frame Spice Gurl film from the original videos in the repo.

The original files remain untouched. No generated imagery or gallery panels.
"""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/videos/spicegurl-reactions'
OUTPUT = ASSETS / 'spicegurl-cinematic-single-screen.mp4'
POSTER = ASSETS / 'spicegurl-cinematic-poster.jpg'

# (name, filename, original in-point, seconds, crop y, frame kind)
SHOTS = [
    ('food_open', 'sandy-cooking.mp4', 1.3, 2.1, 304, 'food'),
    ('two_guests_first_bite', 'reaction-01.mp4', 8.7, 3.2, 162, 'people'),
    ('guest_indoor', 'reaction-02.mp4', 4.2, 2.8, 194, 'people'),
    ('guest_outdoors', 'reaction-03.mp4', 6.5, 3.0, 150, 'people'),
    ('two_guests_reaction', 'reaction-01.mp4', 14.5, 2.8, 156, 'people'),
    ('guest_indoor_finish', 'reaction-02.mp4', 9.6, 2.3, 194, 'people'),
    ('food_close', 'sandy-cooking.mp4', 6.2, 1.9, 304, 'food'),
]


def run(*args):
    subprocess.run(args, check=True)


def duration(path):
    return float(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', str(path)],
        text=True).strip())


def build():
    with tempfile.TemporaryDirectory(prefix='spicegurl-film-') as scratch:
        temp = Path(scratch)
        items = []
        for index, (name, file, start, length, y, kind) in enumerate(SHOTS):
            source = ASSETS / file
            if not source.is_file():
                raise FileNotFoundError(source)
            source_length = duration(source)
            if source_length < length + 0.25:
                raise ValueError(f'Video too short for {name}: {source_length}s')
            start = min(start, source_length - length - 0.1)
            crop = 'crop=512:288:0:304' if kind == 'food' else f'crop=480:270:16:{y}'
            vf = ('scale=512:910:force_original_aspect_ratio=increase,'
                  f'crop=512:910,{crop},scale=960:540:flags=lanczos,'
                  'setsar=1,format=yuv420p')
            part = temp / f'{index:02d}-{name}.mp4'
            run('ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
                '-ss', str(start), '-t', str(length), '-i', str(source),
                '-vf', vf, '-r', '30', '-fps_mode', 'cfr',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
                '-profile:v', 'high', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '96k', '-ar', '48000', '-ac', '2',
                '-af', f'afade=t=in:st=0:d=0.12,afade=t=out:st={length - 0.12:.2f}:d=0.12',
                '-movflags', '+faststart', '-shortest', str(part))
            items.append(part)
        concat = temp / 'segments.txt'
        concat.write_text(''.join(f"file '{item}'\n" for item in items))
        run('ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
            '-f', 'concat', '-safe', '0', '-i', str(concat),
            '-c', 'copy', '-movflags', '+faststart', str(OUTPUT))
        if not 17.8 <= duration(OUTPUT) <= 18.5:
            raise ValueError('Unexpected export duration')
        run('ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
            '-ss', '0.65', '-i', str(OUTPUT), '-frames:v', '1',
            '-q:v', '2', str(POSTER))
        print(f'Built: {OUTPUT} ({OUTPUT.stat().st_size} bytes)')


if __name__ == '__main__':
    build()
