import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { RecipeConfirmation } from '@/components/site/recipe-confirmation';
export const metadata: Metadata = {title:'Підтвердження й видача рецепта — Bake Again',robots:{index:false,follow:false},alternates:null};
export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if(locale!=='uk') notFound();
  return <><SiteHeader locale="uk" pathname="/uk/recept-confirmed"/><main lang="uk"><RecipeConfirmation/></main><SiteFooter locale="uk"/></>;
}
