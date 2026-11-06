from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import re
root = Path(__file__).resolve().parents[2]
tokens = (root/'design-system/tokens.css').read_text().split("html[data-theme='dark']")[0]
def color(name): return HexColor(re.search(r'--'+name+r':\s*(#[0-9a-fA-F]+)', tokens).group(1))
for name,file in [('Body','Manrope-Regular.ttf'),('Bold','Manrope-Semibold.ttf'),('Display','Literata-Semibold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(root/'templates/recipe-pdf/fonts'/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold')
url='https://bakeagain.com/uk/urok/napoleon'
path=root/'output/pdf/Bake-Again-Napoleon-Yak-vidkryty-urok.pdf'
c=canvas.Canvas(str(path),pagesize=(390,720),pageCompression=1)
c.setTitle('Як відкрити відеоурок «Наполеон без глютену»');c.setAuthor('Саша · Bake Again')
c.setFillColor(color('color-background-page'));c.rect(0,0,390,720,fill=1,stroke=0)
def p(text,y,size=14,font='Body',leading=22):
 style=ParagraphStyle('body',fontName=font,fontSize=size,leading=leading,textColor=color('color-text-primary'))
 para=Paragraph(text,style); w,h=para.wrap(326,650);para.drawOn(c,32,y-h);return y-h
p('Bake Again',680,24,'Display',30)
y=p('Наполеон<br/>без глютену',612,28,'Display',36)
y=p('Як відкрити відеоурок',y-20,18,'Bold',26)
y=p('<b>1.</b> Відкрий сторінку уроку за кнопкою нижче.',y-26)
y=p('<b>2.</b> Натисни «Увійти за email покупки» та введи адресу, з якою оформлено замовлення на Payhip.',y-16)
y=p('<b>3.</b> Перейди за посиланням із листа. Після входу відкриються кроки уроку.',y-16)
button_y=y-70
c.setFillColor(color('color-action-primary'));c.roundRect(32,button_y,326,48,4,fill=1,stroke=0)
c.setFillColor(color('color-text-on-accent'));c.setFont('Bold',16);c.drawCentredString(195,button_y+17,'Відкрити урок')
c.linkURL(url,(32,button_y,358,button_y+48),relative=0,thickness=0)
y=p('bakeagain.com/uk/urok/napoleon',button_y-14,12,leading=18)
y=p('Немає листа? Перевір «Промоакції» та спам. Якщо доступ не відкривається, напиши мені:',y-28,13,leading=20)
y=p('<a href="mailto:hello@bakeagain.com"><u>hello@bakeagain.com</u></a>',y-8,14,'Bold')
p('Саша · Bake Again',58,12)
assert y>70,(y,'content overlaps footer')
c.showPage();c.save()
print(path);print('Bytes:',path.stat().st_size)
