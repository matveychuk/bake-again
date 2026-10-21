import { DeliveryError, parseRecipeRequest } from '../../../../lib/newsletter/delivery-service.ts';
import { deliveryBindings, runtimeDelivery, requireRecipeOrigin, readRecipeBody, verifyRecipeChallenge, recipeResponse } from '../../../../lib/newsletter/delivery-runtime.ts';
export async function POST(request: Request) {
  let stage='origin';
  try {
    requireRecipeOrigin(request);
    const input=parseRecipeRequest(await readRecipeBody(request));
    const bindings=await deliveryBindings();
    stage='configuration';
    const service=runtimeDelivery(bindings);
    stage='challenge';
    const network=await verifyRecipeChallenge(request,input.token,bindings);
    stage='delivery';
    await service.request(input.email,input.magnet,network);
    // Identical response for confirmed/new/blocked contacts; don't expose the list.
    return recipeResponse({ok:true});
  } catch(error) {
    const status=error instanceof DeliveryError?error.status:503;
    if(status>=500) console.warn('recipe_request_failed',{stage,status});
    return recipeResponse({ok:false},status);
  }
}
