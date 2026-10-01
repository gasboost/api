export type GeminiApiCallOptions = {
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
  body?: unknown;
};

export class GeminiApiError extends Error {
  constructor(
    public status: number,
    public responseBody: string,
  ) {
    super(`Gemini API request failed with status ${status}: ${responseBody}`);
    this.name = "GeminiApiError";
  }
}

export class GeminiApiClient {
  public baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";

  constructor(
    public apiKey: string,
    public fetcher: GoogleAppsScript.URL_Fetch.UrlFetchApp,
  ) {}

  public call<T>(endpoint: string, options: GeminiApiCallOptions): T {
    const response = this.fetcher.fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method,
      contentType: "application/json",
      headers: {
        "x-goog-api-key": this.apiKey,
      },
      payload:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      muteHttpExceptions: true,
    });
    const status = response.getResponseCode();
    const responseBody = response.getContentText();

    if (status < 200 || status >= 300) {
      throw new GeminiApiError(status, responseBody);
    }

    return JSON.parse(responseBody) as T;
  }
}
