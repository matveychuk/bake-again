import { DeliveryError } from '../../../../lib/newsletter/delivery-service.ts';
import { deliveryBindings, runtimeDelivery, requireRecipeOrigin, readRecipeBody, recipeResponse } from '../../../../lib/newsletter/delivery-runtime.ts';
export async function POST(request: Request) {
  try {
    requireRecipeOrigin(request);
    const body=await readRecipeBody(request) as {token?:unknown};
    if(!body || typeof body.token!=='string') throw new DeliveryError(400);
    const magnet=await runtimeDelivery(await deliveryBindings()).confirm(body.token);
    return recipeResponse({ok:true,magnet});
  } catch(error) { return recipeResponse({ok:false},error instanceof DeliveryError?error.status:503); }
}
