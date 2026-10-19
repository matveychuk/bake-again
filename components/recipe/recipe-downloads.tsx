import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorialInvitation } from '@/components/site/editorial-invitation';
import { crepesDownloads } from '@/content/crepes-downloads';
import styles from './recipe-downloads.module.css';

/** Delivery composition of existing food photography, Button and EditorialInvitation. */
export function RecipeDownloads({ id = 'crepes-downloads' }: { id?: string }) {
  return (
    <>
      <section className={styles.hero} aria-labelledby={`${id}-title`}>
        <div className={styles.copy}>
          <h1 id={`${id}-title`} tabIndex={-1}>Твої млинці — у двох PDF</h1>
          <p className={styles.intro}>Збережи рецепт для кухні, а картку юного кухаря — для перших самостійних млинців.</p>
          <ul className={styles.files} aria-label="Матеріали для завантаження">
            {crepesDownloads.map((file, index) => (
              <li key={file.id}>
                <Button href={file.href} download variant={index === 0 ? 'default' : 'outline'} data-recipe-download={file.id}>
                  <Download aria-hidden="true" />
                  <span>{file.title}</span>
                </Button>
                <p>{file.description}</p>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Якщо PDF відкриється у браузері, скористайся кнопкою збереження або «Поділитися» → «Зберегти у Файли».</p>
        </div>
        {/* oxlint-disable-next-line next/no-img-element -- Existing prepared recipe photograph. */}
        <img className={styles.image} src="/images/crepes.webp" alt="Тонкі золотаві млинці, складені на тарілці" width={1200} height={900} fetchPriority="high" />
      </section>
      <EditorialInvitation
        titleId={`${id}-next`}
        title="Що далі"
        description="Відкрий рецепт на сайті: там можна перерахувати інгредієнти й готувати крок за кроком із таймером."
        note="Почни з невеликої порції тіста на добре розігрітій пательні. Якщо щось не виходить, зазирни в підказки PDF."
        action={<Button href="/uk/recipes/bezghliutenovi-mlyntsi" variant="outline">Готувати млинці на сайті</Button>}
      />
    </>
  );
}
