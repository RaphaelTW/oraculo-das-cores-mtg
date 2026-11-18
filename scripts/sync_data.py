#!/usr/bin/env python3
"""Update inline static JSON from the editable authoring catalogue."""
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def sync(output):
    data=json.loads((ROOT/'data/perguntas_e_catalogo.json').read_text(encoding='utf-8'))
    assert len(data['questions'])==45, 'O projeto espera 45 perguntas; revise o motor se mudar isso.'
    assert len(data['types'])>0
    payload=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    page=output.read_text(encoding='utf-8')
    regex=r'(<script\b(?=[^>]*\bid="quiz-data")(?=[^>]*\btype="application/json")[^>]*>).*?(</script>)'
    page,count=re.subn(regex,lambda m:m.group(1)+payload+m.group(2),page,count=1,flags=re.S)
    if count!=1:raise ValueError('Não encontrei script quiz-data no HTML de saída.')
    output.write_text(page,encoding='utf-8')
    return (len(data['questions']),len(data['tribes']),len(data['types']))

if __name__=='__main__':
    print('Atualizado site/index.html:',sync(ROOT/'site/index.html'))
