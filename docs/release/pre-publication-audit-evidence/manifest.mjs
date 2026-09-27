import fs from 'node:fs';
import {recipeDocuments,getRecipeContent} from '../../../content/recipes/registry.ts';
import {recipeSlugs} from '../../../lib/i18n/recipe-slugs.ts';
const rows=recipeDocuments.flatMap(d=>['uk','en','es'].map(locale=>({id:d.recipe.id,locale,path:`/${locale}/recipes/${recipeSlugs[d.recipe.id][locale]}`,publication:d.recipe.publicationStatus,content:getRecipeContent(d.recipe.id,locale)})));
fs.writeFileSync(new URL('./manifest.json',import.meta.url),JSON.stringify(rows,null,2));
console.log(rows.map(r=>({id:r.id,publication:r.publication})).filter(r=>r.id==='plum-cake'));
