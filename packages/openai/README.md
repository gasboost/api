# @gasboost/openai

Google Apps Script friendly OpenAI Responses API client.

## Install

```sh
pnpm add @gasboost/openai
```

## Usage

```ts
import { OpenAI } from "@gasboost/openai";

const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

const response = openai.responses.create({
  model: "gpt-5-mini",
  input: "Hello",
});
```

Continue from a previous response:

```ts
const next = openai.responses.create({
  model: "gpt-5-mini",
  previous_response_id: response.id,
  input: "Continue",
});
```

Pass function call outputs back to the model:

```ts
openai.responses.create({
  model: "gpt-5-mini",
  input: [
    {
      type: "function_call_output",
      call_id: "call_123",
      output: "{\"temperature\":\"72F\"}",
    },
  ],
});
```

For Node-based tests, inject a `UrlFetchApp` compatible fetcher:

```ts
import { NodeUrlFetchApp } from "@gasboost/fake-node";
import { OpenAI } from "@gasboost/openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  fetcher: new NodeUrlFetchApp(),
});
```

## Scripts

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm pack:smoke
```

Integration tests call the real OpenAI API and require `packages/openai/.env`:

```sh
OPENAI_API_KEY=...
pnpm test:integration
```
