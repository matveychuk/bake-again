"""Build a Ukrainian Bake Again recipe PDF from recipe-specific JSON, not crepe constants."""
from pathlib import Path
from io import BytesIO
from html import escape
import argparse
import hashlib
import json
import re

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / 'templates/recipe-pdf'


def markup(value):
    return escape(str(value)).replace('&lt;br/&gt;', '<br/>').replace('\n', '<br/>')


def required_text(value, field):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f'Заповніть поле {field}.')


def validate(data, base):
    for name in ['title', 'canonicalSource', 'recipeUrl', 'measurementMode']:
        required_text(data.get(name), name)
    if data.get('locale') != 'uk':
        raise ValueError('Поточний генератор має українські лейбли; локалізуйте їх перед іншою мовою.')
    if not data['recipeUrl'].startswith('https://'):
        raise ValueError('recipeUrl має бути точним HTTPS-посиланням рецепта.')
    if data['measurementMode'] not in ['author-spoons', 'grams', 'mixed']:
        raise ValueError('measurementMode: author-spoons, grams або mixed.')
    for name in ['quantitiesAndStepsChecked', 'timingsChecked', 'adaptationStatusChecked']:
        if data.get('contentChecks', {}).get(name) is not True:
            raise ValueError(f'Виконайте й запишіть перевірку contentChecks.{name}.')
    if not (ROOT / data['canonicalSource']).is_file():
        raise ValueError('Не знайдено канонічного джерела: ' + data['canonicalSource'])
    for name in ['primaryTitle', 'accentTitle', 'facts']:
        required_text(data.get('cover', {}).get(name), 'cover.' + name)
    if not data.get('ingredients') or not data.get('steps'):
        raise ValueError('Потрібні власні інгредієнти й кроки рецепта.')
    for i, item in enumerate(data['ingredients']):
        for name in ['name', 'quantity']:
            required_text(item.get(name), f'ingredients[{i}].{name}')
    images = [data['cover'].get('hero', {})]
    if data['cover'].get('flour'):
        required_text(data['cover']['flour'].get('name'), 'cover.flour.name')
        images.append(data['cover']['flour'])
    ids = set()
    for i, step in enumerate(data['steps']):
        for name in ['id', 'title', 'body']:
            required_text(step.get(name), f'steps[{i}].{name}')
        if step['id'] in ids:
            raise ValueError('Повторений id кроку: ' + step['id'])
        ids.add(step['id'])
        images.append(step)
    for item in images:
        required_text(item.get('image'), 'image')
        required_text(item.get('alt'), 'alt')
        path = (base / item['image']).resolve()
        if not path.is_file():
            raise ValueError('Не знайдено фото: ' + str(path))
        Image.open(path).verify()
        crop = item.get('crop', [0, 0, 1, 1])
        if (len(crop) != 4 or not all(isinstance(x, (int, float)) and 0 <= x <= 1 for x in crop)
                or crop[0] >= crop[2] or crop[1] >= crop[3]):
            raise ValueError('crop має бути [left, top, right, bottom], 0..1, з додатною площею.')


class RecipePDF:
    def __init__(self, data, base, work, output):
        self.data, self.base, self.work, self.output = data, base, work, output
        self.layout = json.loads((TEMPLATE / 'layout.json').read_text())
        self.types = self.layout['type']
        self.media = self.layout['media']
        self.tokens = (ROOT / self.layout['tokensFile']).read_text().split('html:lang(uk)')[0]
        self.w = self.layout['page']['widthPt']
        self.h = self.layout['page']['heightPt']
        token = self.layout['page']['marginToken']
        self.m = float(re.search('--' + token + r':\s*([\d.]+)rem', self.tokens).group(1)) * 16
        self.cw = self.w - 2 * self.m
        self.bottom = self.h - self.layout['page']['contentBottomInsetPt']
        self.boxes = []
        for name, key in [('Body', 'body'), ('BodyBold', 'bodyStrong'), ('LabelBold', 'guidanceLabel'),
                          ('Display', 'display'), ('DisplayItalic', 'displayItalic'), ('Brand', 'brand')]:
            pdfmetrics.registerFont(TTFont(name, str(TEMPLATE / 'fonts' / self.layout['fonts'][key])))
        names = [pdfmetrics.getFont(x).face.name for x in ['Body', 'BodyBold', 'LabelBold']]
        if len(set(names)) != 3:
            raise ValueError('Regular / Semibold / LabelBold повинні мати різні внутрішні імена.')
        self.ingredient_pages = self.plan_ingredients()
        self.n = 1 + len(self.ingredient_pages) + len(data['steps'])
        self.master = work / (output.stem + '-source.pdf')
        if output == self.master:
            raise ValueError('Майстер і доставка мають бути окремими файлами.')
        self.c = canvas.Canvas(str(self.master), pagesize=(self.w, self.h), pageCompression=1)
        self.c.setTitle(data['title'] + ' | Bake Again')
        self.c.setAuthor('Bake Again')
        self.c.setCreator('Bake Again recipe PDF template 1.0')
        self.c._doc.Catalog.Lang = PDFString('uk-UA')

    def color(self, name):
        match = re.search('--' + name + r':\s*(#[0-9a-f]+)', self.tokens)
        if not match:
            raise ValueError('Не знайдено семантичний колір ' + name)
        return HexColor(match.group(1))

    def measure(self, text, width, size=16, leading=24, font='Body'):
        return Paragraph(text, ParagraphStyle('p', fontName=font, fontSize=size, leading=leading)).wrap(width, self.h)[1]

    def p(self, text, top, size=16, leading=24, font='Body', color='color-text-primary', x=None, width=None):
        x = self.m if x is None else x
        width = self.cw if width is None else width
        para = Paragraph(text, ParagraphStyle('p', fontName=font, fontSize=size, leading=leading, textColor=self.color(color)))
        height = para.wrap(width, self.h)[1]
        if top + height > self.h - self.m:
            raise ValueError(f'Текст не вміщується на сторінці {self.c.getPageNumber()}: {text}')
        para.drawOn(self.c, x, self.h - top - height)
        self.boxes.append({'page':self.c.getPageNumber(), 'kind':'text', 'text':text,
                           'x':x, 'y':top, 'w':width, 'h':height})
        return top + height

    def rect(self, x, top, width, height, color, radius=0):
        self.c.setFillColor(self.color(color))
        if radius:
            self.c.roundRect(x, self.h-top-height, width, height, radius, fill=1, stroke=0)
        else:
            self.c.rect(x, self.h-top-height, width, height, fill=1, stroke=0)

    def line(self, top):
        self.c.setStrokeColor(self.color('color-background-panel'))
        self.c.setLineWidth(.6)
        self.c.line(self.m, self.h-top, self.w-self.m, self.h-top)

    def base_page(self, section):
        self.rect(0, 0, self.w, self.h, 'color-background-page')
        self.p('Bake Again.', self.m, 23, 28, 'Brand', width=190)
        if self.data['cover'].get('glutenFree', True):
            self.rect(self.w-self.m-107, self.m, 107, 28, 'color-action-primary', 4)
            self.p('Без глютену', self.m+6, 12, 16, 'BodyBold', 'color-text-on-accent', x=self.w-self.m-95, width=83)
        self.line(self.h-48)
        self.p(markup(section), self.h-40, 10, 14, color='color-text-secondary', width=self.cw-48)
        self.c.setFillColor(self.color('color-text-secondary'))
        self.c.setFont('Body', 10)
        self.c.drawRightString(self.w-self.m, 26, f'{self.c.getPageNumber()} / {self.n}')

    def photo(self, item, top, height):
        path = (self.base / item['image']).resolve()
        bitmap = Image.open(path).convert('RGB')
        w, h = bitmap.size
        l, t, r, b = item.get('crop', [0, 0, 1, 1])
        bitmap = bitmap.crop((round(l*w), round(t*h), round(r*w), round(b*h)))
        ratio = self.cw / height
        if bitmap.width / bitmap.height > ratio:
            width = round(bitmap.height*ratio)
            x = (bitmap.width-width)//2
            bitmap = bitmap.crop((x, 0, x+width, bitmap.height))
        else:
            h = round(bitmap.width/ratio)
            y = (bitmap.height-h)//2
            bitmap = bitmap.crop((0, y, bitmap.width, y+h))
        max_dim = self.media['masterMaxDimensionPx']
        bitmap.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        buf = BytesIO()
        bitmap.save(buf, 'JPEG', quality=self.media['masterJpegQuality'], optimize=True)
        buf.seek(0)
        self.c.drawImage(ImageReader(buf), self.m, self.h-top-height, self.cw, height)
        self.boxes.append({'page':self.c.getPageNumber(), 'kind':'image', 'source':str(path), 'alt':item['alt'],
                           'x':self.m, 'y':top, 'w':self.cw, 'h':height})
        return top + height

    def guidance_markup(self, text, kind):
        label = 'ПОРАДА' if kind == 'tip' else 'ОРІЄНТИР'
        color = self.color('color-action-primary-strong' if kind == 'tip' else 'color-text-primary').hexval()
        return f'<font name="LabelBold" size="{self.types["guidanceLabelPt"]}" color="{color}">{label}</font>&nbsp;&nbsp;{markup(text)}'

    def guidance_height(self, text, kind):
        return self.measure(self.guidance_markup(text, kind), self.cw-60,
                            self.types['guidanceBodyPt'], self.types['guidanceLeadingPt']) + 24

    def guidance(self, text, top, kind='checkpoint'):
        height = self.guidance_height(text, kind)
        self.rect(self.m, top, self.cw, height,
                  'color-status-suggested-background' if kind == 'tip' else 'color-background-panel-subtle')
        x, y = self.m+23, self.h-top-height/2
        self.c.setStrokeColor(self.color('color-action-primary-strong'))
        self.c.setLineWidth(1.2)
        if kind == 'tip':
            self.c.circle(x, y+2, 5, fill=0, stroke=1)
            self.c.line(x-3, y-3, x+3, y-3)
            self.c.line(x-3, y-6, x+3, y-6)
            self.rect(self.m, top, 3, height, 'color-action-primary')
        else:
            self.c.circle(x, y, 7, fill=0, stroke=1)
            self.c.line(x-4, y, x-1, y-3)
            self.c.line(x-1, y-3, x+4, y+3)
        self.p(self.guidance_markup(text, kind), top+12, self.types['guidanceBodyPt'],
               self.types['guidanceLeadingPt'], x=self.m+44, width=self.cw-60)
        return top + height

    def cover(self):
        data = self.data['cover']
        self.base_page('bakeagain.com')
        end = self.p(markup(data['primaryTitle']), 88, self.types['coverPrimaryPt'], self.types['coverPrimaryLeadingPt'], 'Display')
        end = self.p(markup(data['accentTitle']), end, self.types['coverAccentPt'], self.types['coverAccentLeadingPt'], 'DisplayItalic', 'color-action-primary')
        end = self.p(markup(data['facts']), end+20, 16, 24, 'BodyBold')
        photo_top = end+24
        link_top = self.h-72
        flour = data.get('flour')
        pack_top = link_top-112
        photo_bottom = pack_top-24 if flour else link_top-24
        photo_height = min(self.media['stepMaxHeightPt'] if flour else 342, photo_bottom-photo_top)
        if photo_height < self.media['stepMinHeightPt']:
            raise ValueError('Назва/факти обкладинки занадто довгі. Скоротіть повтори, не основний шрифт.')
        self.photo(data['hero'], photo_top, photo_height)
        if flour:
            image = Image.open(self.base / flour['image']).convert('RGBA')
            ratio = min(54/image.width, 104/image.height)
            iw, ih = image.width*ratio, image.height*ratio
            self.c.drawImage(ImageReader(image), self.m, self.h-pack_top-ih, iw, ih, mask='auto')
            self.boxes.append({'page':1, 'kind':'image', 'source':flour['image'], 'alt':flour['alt'],
                               'x':self.m, 'y':pack_top, 'w':iw, 'h':ih})
            self.p('Борошно', pack_top+16, 14, 20, color='color-text-secondary', x=self.m+82, width=self.cw-82)
            end = self.p(markup(flour['name']), pack_top+44, 16, 24, 'BodyBold', x=self.m+82, width=self.cw-82)
            if end > link_top-8:
                raise ValueError('Назва суміші в блоці упаковки не вміщується; скоротіть повтори.')
        end = self.p('Рецепти на Bake Again', link_top, 14, 20, 'BodyBold', 'color-action-primary-strong')
        self.c.linkURL(self.data['recipeUrl'], (self.m, self.h-end, self.w-self.m, self.h-link_top), relative=0, thickness=0)
        self.c.showPage()

    def plan_ingredients(self):
        pages, page, top, previous = [], [], 184, None
        for item in self.data['ingredients']:
            section = item.get('section', '')
            height = max(56, 28 + max(self.measure(markup(item['quantity']), 124, 16, 22, 'BodyBold'),
                                       self.measure(markup(item['name']), self.cw-160, 16, 22)))
            new_section = bool(section) and section != previous
            header = self.measure(markup(section), self.cw, 18, 24, 'BodyBold')+12 if section else 0
            if top + (header if new_section else 0) + height > self.bottom:
                if not page:
                    raise ValueError('Занадто довгий рядок інгредієнтів: ' + item['name'])
                pages.append(page)
                page, top = [], 184
                new_section = bool(section)
            if new_section:
                page.append(('section', section, header))
                top += header
            if top + height > self.bottom:
                raise ValueError('Група/рядок інгредієнтів не вміщується: ' + item['name'])
            page.append(('ingredient', item, height))
            top += height
            previous = section
        if page:
            pages.append(page)
        return pages

    def ingredients(self):
        for i, entries in enumerate(self.ingredient_pages):
            self.base_page('Інгредієнти')
            self.p('Що потрібно' if i == 0 else 'Інгредієнти далі', 88, 32, 40, 'Display')
            self.rect(self.m, 152, self.cw, 32, 'color-background-panel-subtle')
            self.p('Кількість', 160, 12, 16, 'BodyBold', x=self.m+12, width=112)
            self.p('Інгредієнт', 160, 12, 16, 'BodyBold', x=self.m+148, width=self.cw-160)
            top = 184
            for kind, item, height in entries:
                if kind == 'section':
                    self.p(markup(item), top+8, 18, 24, 'BodyBold')
                else:
                    self.p(markup(item['quantity']), top+16, 16, 22, 'BodyBold', x=self.m+12, width=124)
                    self.p(markup(item['name']), top+16, 16, 22, x=self.m+148, width=self.cw-160)
                    self.line(top+height)
                top += height
            self.c.showPage()

    def steps(self):
        for i, step in enumerate(self.data['steps'], 1):
            self.base_page('Приготування')
            self.p(f'Крок {i} / {len(self.data["steps"])}', 80, 12, 20, 'BodyBold', 'color-action-primary-strong', width=96)
            if step.get('time'):
                self.p(markup(step['time']), 80, 16, 20, 'BodyBold', 'color-action-primary-strong', x=self.m+112, width=self.cw-112)
            end = self.p(markup(step['title']), 108, self.types['stepTitlePt'], self.types['stepTitleLeadingPt'], 'Display')
            if step.get('ingredients'):
                end = self.p(markup(step['ingredients']), end+12, self.types['stepIngredientsPt'], 20, 'BodyBold')
            if step.get('tip'):
                end = self.guidance(step['tip'], end+12, 'tip')
            end = self.p(markup(step['body']), end+12, self.types['bodyPt'], self.types['bodyLeadingPt'])
            photo_top = end+16
            extra = 16+self.guidance_height(step['checkpoint'], 'checkpoint') if step.get('checkpoint') else 0
            photo_height = min(self.media['stepMaxHeightPt'], self.bottom-photo_top-extra)
            if photo_height < self.media['stepMinHeightPt']:
                raise ValueError(f'Крок {i} не вміщується з великим фото. Скоротіть повтори або розділіть реальну дію.')
            end = self.photo(step, photo_top, photo_height)
            if step.get('checkpoint'):
                end = self.guidance(step['checkpoint'], end+16)
            if end > self.bottom:
                raise ValueError(f'Зміст кроку {i} виходить у футер.')
            self.c.showPage()

    def save(self):
        self.cover()
        self.ingredients()
        self.steps()
        self.c.save()
        for i, a in enumerate(self.boxes):
            for b in self.boxes[i+1:]:
                if (a['page'] == b['page'] and min(a['x']+a['w'], b['x']+b['w'])-max(a['x'], b['x']) > .5
                        and min(a['y']+a['h'], b['y']+b['h'])-max(a['y'], b['y']) > .5):
                    raise ValueError(f'Перетин змістових блоків: {a} / {b}')
        writer = PdfWriter(clone_from=self.master)
        for page in writer.pages:
            for image in page.images:
                bitmap = image.image.copy().convert('RGB')
                bitmap.thumbnail((self.media['deliveryMaxWidthPx'], self.media['deliveryMaxHeightPx']), Image.Resampling.LANCZOS)
                image.replace(bitmap, quality=self.media['deliveryJpegQuality'], optimize=True)
            page.compress_content_streams()
        writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
        writer.write(self.output)
        master, delivery = PdfReader(self.master), PdfReader(self.output)
        if len(delivery.pages) != self.n or [p.extract_text() for p in master.pages] != [p.extract_text() for p in delivery.pages]:
            raise ValueError('Оптимізація змінила кількість сторінок або текст.')
        uris = [a.get_object().get('/A', {}).get('/URI') for p in delivery.pages for a in p.get('/Annots', [])]
        if set(uris) != {self.data['recipeUrl']}:
            raise ValueError('Посилання доставки не відповідає recipeUrl.')
        text = '\n\n'.join(p.extract_text() for p in delivery.pages)
        if '\ufffd' in text:
            raise ValueError('У тексті PDF є символ заміни.')
        report = {'pdf':str(self.output), 'source':str(self.master), 'pages':self.n,
                  'bytes':self.output.stat().st_size, 'sourceBytes':self.master.stat().st_size,
                  'sha256':hashlib.sha256(self.output.read_bytes()).hexdigest(),
                  'pageSizePt':[self.w, self.h], 'templateVersion':self.layout['version'],
                  'vectorTextUnchanged':True, 'layoutOverlaps':0, 'links':uris,
                  'canonicalSourceSha256':hashlib.sha256((ROOT/self.data['canonicalSource']).read_bytes()).hexdigest(),
                  'sourceCorrections':self.data.get('sourceCorrections', []),
                  'visualReview':'pending; render and inspect delivery PDF',
                  'phoneDeliveryTest':'pending; actual device and delivery button required'}
        (self.work/'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
        (self.work/'layout-boxes.json').write_text(json.dumps(self.boxes, ensure_ascii=False, indent=2)+'\n')
        (self.work/'extracted-text.txt').write_text(text)
        return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', required=True, type=Path)
    parser.add_argument('--work-dir', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    data_path, work, output = args.data.resolve(), args.work_dir.resolve(), args.output.resolve()
    if output.suffix.lower() != '.pdf':
        raise ValueError('--output має бути окремим PDF-файлом.')
    data = json.loads(data_path.read_text())
    validate(data, data_path.parent)
    work.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    report = RecipePDF(data, data_path.parent, work, output).save()
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
