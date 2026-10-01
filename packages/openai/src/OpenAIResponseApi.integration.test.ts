import { NodeUrlFetchApp } from "@gasboost/fake-node";
import { describe, expect, it } from "vitest";
import { OpenAI } from "./OpenAI";

declare const process: {
  env: {
    OPENAI_API_KEY?: string;
  };
};

const apiKey = process.env.OPENAI_API_KEY;
const integrationIt = apiKey === undefined ? it.skip : it;

describe("OpenAIResponseApi integration", () => {
  integrationIt("creates a response through the real OpenAI API", () => {
    const openai = new OpenAI({
      apiKey: apiKey ?? "",
      fetcher: new NodeUrlFetchApp(),
    });

    const response = openai.responses.create({
      model: "gpt-5-mini",
      input: "Return exactly this text and nothing else: gasboost-ok",
      temperature: 0,
      max_output_tokens: 32,
    });

    expect(response.object).toBe("response");
    expect(response.id.length).toBeGreaterThan(0);
    expect(response.status).toBe("completed");
    expect(
      response.output.some(
        (item) =>
          item.type === "message" &&
          item.content.some(
            (content) =>
              content.type === "output_text" &&
              content.text.includes("gasboost-ok"),
          ),
      ),
    ).toBe(true);
  });
});
