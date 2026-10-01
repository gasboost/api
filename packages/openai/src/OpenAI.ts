import { OpenAIApiClient } from "./OpenAIApiClient";
import { OpenAIResponseApi } from "./OpenAIResponseApi";

export type OpenAIOptions = {
  apiKey: string;
  fetcher?: GoogleAppsScript.URL_Fetch.UrlFetchApp;
};

export class OpenAI {
  constructor(options: OpenAIOptions) {
    const client = new OpenAIApiClient(
      options.apiKey,
      options.fetcher ?? UrlFetchApp,
    );
    this.responses = new OpenAIResponseApi(client);
  }

  public responses: OpenAIResponseApi;
}
