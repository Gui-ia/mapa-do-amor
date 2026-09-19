"""Render user-provided testimonial texts as branded PNG cards, without invented ratings."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parent
source=root/'testimonials.json'
rows=json.loads(source.read_text())
font_path='/System/Library/Fonts/Supplemental/Arial.ttf'
body=ImageFont.truetype(font_path,34)
small=ImageFont.truetype(font_path,25)
brand=ImageFont.truetype(font_path,28)
out=root/'assets'/'testimonials'
out.mkdir(exist_ok=True)
measure=ImageDraw.Draw(Image.new('RGB',(10,10)))
result=[]
for index,row in enumerate(rows):
 if not row.get('name') or not row.get('text'):raise ValueError('Every testimonial needs the supplied name and text.')
 names=row['name']; texts=row['text'];images={}
 if isinstance(texts,str):texts={'pt':texts,'de':texts}
 for lang in ['pt','de']:
  text=texts.get(lang) or next(iter(texts.values()))
  lines=[]
  for para in text.split('\n'):
   line=''
   for word in para.split():
    test=(line+' '+word).strip()
    if measure.textlength(test,font=body)>740 and line:lines.append(line);line=word
    else:line=test
   lines.append(line)
  height=max(650,340+len(lines)*51)
  im=Image.new('RGB',(900,height),'#fffaf9');draw=ImageDraw.Draw(im)
  draw.rounded_rectangle((20,20,880,height-20),radius=30,fill='white',outline='#ead7df',width=2)
  draw.text((80,65),'HERZLINIEN',font=brand,fill='#933b62')
  draw.text((80,118),'“',font=ImageFont.truetype(font_path,70),fill='#e62d71')
  y=180
  for line in lines:draw.text((80,y),line,font=body,fill='#342732');y+=51
  draw.line((80,height-115,820,height-115),fill='#ead7df',width=2)
  draw.text((80,height-85),names,font=small,fill='#725462')
  target=out/f'depoimento-{index+1}-{lang}.png';im.save(target)
  images[lang]=str(target.relative_to(root))
 result.append({**row,'image':images})
p=root/'quiz-copy-data.json';d=json.loads(p.read_text());d['testimonials']=result;p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
exec((root/'sync-copy.py').read_text())
print(f'{len(result)} depoimentos reais renderizados. Nenhuma avaliação, estrela ou selo acrescentado.')
