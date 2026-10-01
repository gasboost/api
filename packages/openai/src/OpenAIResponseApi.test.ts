import { describe, expect, it, vi } from "vitest";
import { OpenAI } from "./OpenAI";
import { OpenAIApiError } from "./OpenAIApiClient";

describe("OpenAIResponseApi", () => {
  it("posts response create requests with bearer authentication", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "resp_1",
          object: "response",
          created_at: 1790838000,
          status: "completed",
          error: null,
          model: "gpt-5-mini",
          output: [],
        }),
      getHeaders: () => ({
        "x-request-id": "req_1",
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
    const openai = new OpenAI({ apiKey: "test-api-key", fetcher });

    const created = openai.responses.create({
      model: "gpt-5-mini",
      input: "Hello",
    });

    expect(fetch).toHaveBeenCalledWith("https://api.openai.com/v1/responses", {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer test-api-key",
      },
      payload: JSON.stringify({
        model: "gpt-5-mini",
        input: "Hello",
      }),
      muteHttpExceptions: true,
    });
    expect(created.id).toBe("resp_1");
  });

  it("passes previous_response_id for continuation", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "resp_2",
          object: "response",
          created_at: 1790838000,
          status: "completed",
          error: null,
          model: "gpt-5-mini",
          output: [],
          previous_response_id: "resp_1",
        }),
      getHeaders: () => ({}),
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
    const openai = new OpenAI({ apiKey: "test-api-key", fetcher });

    openai.responses.create({
      model: "gpt-5-mini",
      input: "Continue",
      previous_response_id: "resp_1",
    });

    expect(fetch.mock.calls[0]?.[1]?.payload).toBe(
      JSON.stringify({
        model: "gpt-5-mini",
        input: "Continue",
        previous_response_id: "resp_1",
      }),
    );
  });

  it("posts function tools and function_call_output items", () => {
    const response = {
      getResponseCode: () => 200,
      getContentText: () =>
        JSON.stringify({
          id: "resp_3",
          object: "response",
          created_at: 1790838000,
          status: "completed",
          error: null,
          model: "gpt-5-mini",
          output: [
            {
              id: "fc_1",
              type: "function_call",
              call_id: "call_1",
              name: "get_weather",
              arguments: "{\"location\":\"Boston, MA\"}",
              status: "completed",
            },
          ],
        }),
      getHeaders: () => ({}),
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
    const openai = new OpenAI({ apiKey: "test-api-key", fetcher });

    const created = openai.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "user",
          content: "What is the weather?",
        },
        {
          type: "function_call_output",
          call_id: "call_1",
          output: "{\"temperature\":\"72F\"}",
        },
      ],
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
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: {
        type: "function",
        name: "get_weather",
      },
    });

    expect(fetch.mock.calls[0]?.[1]?.payload).toContain(
      '"type":"function_call_output"',
    );
    expect(fetch.mock.calls[0]?.[1]?.payload).toContain('"type":"function"');
    expect(created.output[0]?.type).toBe("function_call");
  });

  it("throws OpenAIApiError for non-2xx responses", () => {
    const response = {
      getResponseCode: () => 401,
      getContentText: () => '{"error":{"message":"bad key"}}',
      getHeaders: () => ({
        "x-request-id": "req_error",
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
    const openai = new OpenAI({ apiKey: "test-api-key", fetcher });

    expect(() =>
      openai.responses.create({
        model: "gpt-5-mini",
        input: "Hello",
      }),
    ).toThrow(OpenAIApiError);
  });
});
