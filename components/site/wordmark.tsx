type WordmarkProps = {
  href?: string;
  className?: string;
};

export function Wordmark({ href = '/', className = 'wordmark' }: WordmarkProps) {
  return (
    <a className={className} href={href} aria-label="Bake Again home">
      Bake Again<span aria-hidden="true">.</span>
    </a>
  );
}
