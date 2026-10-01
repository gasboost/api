export type OpenAIApiCallOptions = {
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
  body?: OpenAIJsonValue;
};

export type OpenAIJsonPrimitive = string | number | boolean | null;

export type OpenAIJsonValue =
  | OpenAIJsonPrimitive
  | OpenAIJsonValue[]
  | OpenAIJsonObject;

export type OpenAIJsonObject = {
  [key: string]: OpenAIJsonValue;
};

export class OpenAIApiError extends Error {
  constructor(
    public status: number,
    public responseBody: string,
    public requestId?: string,
  ) {
    super(`OpenAI API request failed with status ${status}: ${responseBody}`);
    this.name = "OpenAIApiError";
  }
}

export class OpenAIApiClient {
  public baseUrl: string = "https://api.openai.com/v1";

  constructor(
    public apiKey: string,
    public fetcher: GoogleAppsScript.URL_Fetch.UrlFetchApp,
  ) {}

  public call<T>(endpoint: string, options: OpenAIApiCallOptions): T {
    const response = this.fetcher.fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method,
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      payload:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      muteHttpExceptions: true,
    });
    const status = response.getResponseCode();
    const responseBody = response.getContentText();
    const headers = response.getHeaders() as Record<string, string | string[]>;
    const requestIdHeader = headers["x-request-id"] ?? headers["X-Request-Id"];
    const requestId =
      typeof requestIdHeader === "string" ? requestIdHeader : undefined;

    if (status < 200 || status >= 300) {
      throw new OpenAIApiError(status, responseBody, requestId);
    }

    return JSON.parse(responseBody) as T;
  }
}
