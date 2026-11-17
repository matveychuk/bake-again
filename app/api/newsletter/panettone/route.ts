import { brevoApi } from '@/lib/newsletter/brevo-api';
import {
  deliveryStore,
  type DeliveryDatabase,
} from '@/lib/newsletter/delivery-store';
import { DeliveryError } from '@/lib/newsletter/delivery-service';
import {
  deliveryBindings,
  requireRecipeOrigin,
  readRecipeBody,
  verifyRecipeChallenge,
  recipeResponse,
} from '@/lib/newsletter/delivery-runtime';
import {
  createPanettoneService,
  panettoneConfigured,
  panettoneListId,
  parsePanettoneRequest,
} from '@/lib/newsletter/panettone';

export async function POST(request: Request) {
  try {
    const bindings = await deliveryBindings();
    requireRecipeOrigin(request, bindings);
    const input = parsePanettoneRequest(await readRecipeBody(request));
    if (!panettoneConfigured(bindings) || !bindings.ASSISTANT_QUOTAS)
      throw new DeliveryError(503);
    const network = await verifyRecipeChallenge(
      request,
      input.token,
      bindings,
      fetch,
      'panettone_signup',
    );
    const subscribe = createPanettoneService(
      deliveryStore(bindings.ASSISTANT_QUOTAS as DeliveryDatabase),
      brevoApi(bindings.BREVO_API_KEY as string),
      panettoneListId(bindings)!,
    );
    await subscribe(input.email, input.source, network, input.signupPage);
    return recipeResponse({ ok: true });
  } catch (error) {
    return recipeResponse(
      { ok: false },
      error instanceof DeliveryError ? error.status : 503,
    );
  }
}
