import { NodeUrlFetchApp } from "@gasboost/fake-node";
import { describe, expect, it } from "vitest";
import { Gemini } from "./Gemini";

declare const process: {
  env: {
    GEMINI_API_KEY?: string;
  };
};

const apiKey = process.env.GEMINI_API_KEY;
const integrationIt = apiKey === undefined ? it.skip : it;

describe("GeminiInteractionApi integration", () => {
  integrationIt("creates an interaction through the real Gemini API", () => {
    const gemini = new Gemini({
      apiKey: apiKey ?? "",
      fetcher: new NodeUrlFetchApp(),
    });

    const interaction = gemini.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: "Return exactly this text and nothing else: gasboost-ok",
      generation_config: {
        temperature: 0,
        max_output_tokens: 32,
      },
    });

    expect(interaction.object).toBe("interaction");
    expect(interaction.id.length).toBeGreaterThan(0);
    expect(interaction.status).toBe("completed");
    expect(interaction.model).toBe("gemini-3.5-flash-lite");
    expect(
      interaction.steps?.some(
        (step) =>
          step.type === "model_output" &&
          step.content?.some(
            (content) =>
              content.type === "text" && content.text.includes("gasboost-ok"),
          ),
      ),
    ).toBe(true);
  });
});
