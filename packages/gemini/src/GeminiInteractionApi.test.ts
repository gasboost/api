import { describe, expect, it, vi } from "vitest";
import { Gemini } from "./Gemini";
import { GeminiApiError } from "./GeminiApiClient";

describe("GeminiInteractionApi", () => {
  it("posts interaction create requests with the Gemini API key", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "interaction_1",
          object: "interaction",
          status: "completed",
          created: "2026-10-01T00:00:00Z",
          updated: "2026-10-01T00:00:01Z",
          model: "gemini-3-flash-preview",
        }),
    } as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
    const fetch = vi.fn<
      (
        url: string,
        params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
      ) => GoogleAppsScript.URL_Fetch.HTTPResponse
    >(() => response);
    const fetcher = {
      fetch,
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;
    const gemini = new Gemini({ apiKey: "test-api-key", fetcher });

    const interaction = gemini.interactions.create({
      model: "gemini-3-flash-preview",
      input: "Hello",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "post",
        contentType: "application/json",
        headers: {
          "x-goog-api-key": "test-api-key",
        },
        payload: JSON.stringify({
          model: "gemini-3-flash-preview",
          input: "Hello",
        }),
        muteHttpExceptions: true,
      },
    );
    expect(interaction.id).toBe("interaction_1");
  });

  it("passes previous_interaction_id for multi-turn interactions", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "interaction_2",
          object: "interaction",
          status: "completed",
          created: "2026-10-01T00:00:00Z",
          updated: "2026-10-01T00:00:01Z",
        }),
    } as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
    const fetch = vi.fn<
      (
        url: string,
        params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
      ) => GoogleAppsScript.URL_Fetch.HTTPResponse
    >(() => response);
    const fetcher = {
      fetch,
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;
    const gemini = new Gemini({ apiKey: "test-api-key", fetcher });

    gemini.interactions.create({
      model: "gemini-3-flash-preview",
      input: "What about Japan?",
      previous_interaction_id: "interaction_1",
    });

    expect(fetch.mock.calls[0]?.[1]?.payload).toBe(
      JSON.stringify({
        model: "gemini-3-flash-preview",
        input: "What about Japan?",
        previous_interaction_id: "interaction_1",
      }),
    );
  });

  it("posts typed tools, response format, and generation config", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "interaction_3",
          object: "interaction",
          status: "requires_action",
          created: "2026-10-01T00:00:00Z",
          updated: "2026-10-01T00:00:01Z",
          model: "gemini-3-flash-preview",
          steps: [
            {
              type: "function_call",
              id: "call_1",
              name: "get_weather",
              arguments: {
                location: "Boston, MA",
              },
            },
          ],
        }),
    } as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
    const fetch = vi.fn<
      (
        url: string,
        params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
      ) => GoogleAppsScript.URL_Fetch.HTTPResponse
    >(() => response);
    const fetcher = {
      fetch,
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;
    const gemini = new Gemini({ apiKey: "test-api-key", fetcher });

    const interaction = gemini.interactions.create({
      model: "gemini-3-flash-preview",
      input: "What is the weather?",
      tools: [
        {
          type: "function",
          name: "get_weather",
          description: "Gets current weather for a location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
              },
            },
            required: ["location"],
          },
        },
        {
          type: "google_search",
          search_types: ["web_search"],
        },
      ],
      response_format: {
        type: "object",
        properties: {
          answer: {
            type: "string",
          },
        },
        required: ["answer"],
      },
      response_mime_type: "application/json",
      generation_config: {
        thinking_level: "low",
        tool_choice: {
          mode: "auto",
          tools: ["get_weather"],
        },
      },
    });

    expect(fetch.mock.calls[0]?.[1]?.payload).toContain(
      '"tools":[{"type":"function","name":"get_weather"',
    );
    expect(fetch.mock.calls[0]?.[1]?.payload).toContain(
      '"response_mime_type":"application/json"',
    );
    expect(interaction.steps?.[0]?.type).toBe("function_call");
  });

  it("throws GeminiApiError for non-2xx responses", () => {
    const response = {
      getResponseCode: () => 400,
      getContentText: () => '{"error":"bad request"}',
    } as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
    const fetch = vi.fn<
      (
        url: string,
        params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
      ) => GoogleAppsScript.URL_Fetch.HTTPResponse
    >(() => response);
    const fetcher = {
      fetch,
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;
    const gemini = new Gemini({ apiKey: "test-api-key", fetcher });

    expect(() =>
      gemini.interactions.create({
        model: "gemini-3-flash-preview",
        input: "Hello",
      }),
    ).toThrow(GeminiApiError);
  });
});
