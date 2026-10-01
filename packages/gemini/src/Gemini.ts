import { GeminiApiClient } from "./GeminiApiClient";
import { GeminiInteractionApi } from "./GeminiInteractionApi";

export type GeminiOptions = {
  apiKey: string;
  fetcher?: GoogleAppsScript.URL_Fetch.UrlFetchApp;
};

export class Gemini {
  constructor(options: GeminiOptions) {
    const client = new GeminiApiClient(
      options.apiKey,
      options.fetcher ?? UrlFetchApp,
    );
    this.interactions = new GeminiInteractionApi(client);
  }

  public interactions: GeminiInteractionApi;
}
