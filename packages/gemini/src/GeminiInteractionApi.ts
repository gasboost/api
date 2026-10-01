import { GeminiApiClient } from "./GeminiApiClient";
import type {
  CreateGeminiInteractionRequest,
  GeminiInteraction,
} from "./GeminiInteraction";

export class GeminiInteractionApi {
  constructor(public client: GeminiApiClient) {}

  public create(request: CreateGeminiInteractionRequest): GeminiInteraction {
    return this.client.call<GeminiInteraction>("/interactions", {
      method: "post",
      body: request,
    });
  }
}
