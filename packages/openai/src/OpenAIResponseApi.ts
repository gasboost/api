import { OpenAIApiClient } from "./OpenAIApiClient";
import type {
  CreateOpenAIResponseRequest,
  OpenAIResponse,
} from "./OpenAIResponse";

export class OpenAIResponseApi {
  constructor(public client: OpenAIApiClient) {}

  public create(request: CreateOpenAIResponseRequest): OpenAIResponse {
    return this.client.call<OpenAIResponse>("/responses", {
      method: "post",
      body: request,
    });
  }
}
