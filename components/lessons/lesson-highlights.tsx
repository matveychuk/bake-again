import styles from './lesson.module.css';

export function LessonHighlights() {
  return (
    <ul className={styles.highlights}>
      <li>Як зробити масляну крихту, з якої виходять шаруваті коржі.</li>
      <li>Яким тісто має бути на дотик.</li>
      <li>Як розкачати тонкий корж, щоб він не рвався.</li>
      <li>Як отримати в коржі повітряні порожнинки й хрумкість.</li>
      <li>Як зварити заварний крем, щоб він не пригорів і не пішов грудками.</li>
    </ul>
  );
}
