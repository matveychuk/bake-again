import { brevoApi } from '@/lib/newsletter/brevo-api';
import {
  deliveryStore,
  type DeliveryDatabase,
} from '@/lib/newsletter/delivery-store';
import { DeliveryError } from '@/lib/newsletter/delivery-service';
import {
  deliveryBindings,
  readRecipeBody,
  recipeResponse,
  requireRecipeOrigin,
  verifyRecipeChallenge,
} from '@/lib/newsletter/delivery-runtime';
import {
  createPancakesService,
  pancakesConfigured,
  pancakesListId,
  parsePancakesRequest,
} from '@/lib/newsletter/panettone';

export async function POST(request: Request) {
  try {
    const bindings = await deliveryBindings();
    requireRecipeOrigin(request, bindings);
    const input = parsePancakesRequest(await readRecipeBody(request));
    const listId = pancakesListId(bindings);
    if (
      !pancakesConfigured(bindings) ||
      !bindings.ASSISTANT_QUOTAS ||
      listId === null
    )
      throw new DeliveryError(503);
    const network = await verifyRecipeChallenge(
      request,
      input.token,
      bindings,
      fetch,
      'pancakes_signup',
    );
    const subscribe = createPancakesService(
      deliveryStore(bindings.ASSISTANT_QUOTAS as DeliveryDatabase),
      brevoApi(bindings.BREVO_API_KEY as string),
      listId,
    );
    await subscribe(input.email, input.source, network);
    return recipeResponse({ ok: true });
  } catch (error) {
    return recipeResponse(
      { ok: false },
      error instanceof DeliveryError ? error.status : 503,
    );
  }
}
