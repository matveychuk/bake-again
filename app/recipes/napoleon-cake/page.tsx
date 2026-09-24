import { RecipePage } from '@/components/recipe/recipe-page';

export default async function NapoleonRecipePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const requestedSearchParams = await searchParams;
  return (
    <RecipePage
      slug="napoleon-cake"
      configurationSearch={new URLSearchParams(
        Object.entries(requestedSearchParams).flatMap(([key, value]) =>
          value === undefined
            ? []
            : (Array.isArray(value) ? value : [value]).map(
                (item) => [key, item] as [string, string],
              ),
        ),
      ).toString()}
    />
  );
}
