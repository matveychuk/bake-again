/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { Wordmark } from './wordmark';

export function SiteFooter() {
  return (
    <footer>
      <Wordmark href="#top" />
      <p>
        <a href="/design-system">Design System v1</a> · Warm Precision
      </p>
    </footer>
  );
}
