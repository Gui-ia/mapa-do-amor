"""Regenerate the offline copy bundle after editing quiz-copy-data.json."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
data = json.loads((root / 'quiz-copy-data.json').read_text())
(root / 'copy-data.js').write_text(
    '// Generated from quiz-copy-data.json.\nwindow.MAPA_COPY = '
    + json.dumps(data, ensure_ascii=False) + ';\n'
)
print('copy-data.js atualizado.')
