/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { HomeDiscovery } from './_components/home/home-discovery';
import { HomeHero } from './_components/home/home-hero';
import { HomeRecipes } from './_components/home/home-recipes';
import { HomeTrust } from './_components/home/home-trust';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HomeHero />
      <HomeDiscovery />
      <HomeRecipes />
      <HomeTrust />
      <SiteFooter />
    </main>
  );
}
