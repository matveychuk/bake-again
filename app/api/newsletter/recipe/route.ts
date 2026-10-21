import { DeliveryError, parseRecipeRequest } from '../../../../lib/newsletter/delivery-service.ts';
import { deliveryBindings, runtimeDelivery, requireRecipeOrigin, readRecipeBody, verifyRecipeChallenge, recipeResponse } from '../../../../lib/newsletter/delivery-runtime.ts';
export async function POST(request: Request) {
  try {
    requireRecipeOrigin(request);
    const input=parseRecipeRequest(await readRecipeBody(request));
    const bindings=await deliveryBindings();
    const service=runtimeDelivery(bindings);
    const network=await verifyRecipeChallenge(request,input.token,bindings);
    await service.request(input.email,input.magnet,network);
    // Identical response for confirmed/new/blocked contacts; don't expose the list.
    return recipeResponse({ok:true});
  } catch(error) { return recipeResponse({ok:false},error instanceof DeliveryError?error.status:503); }
}
