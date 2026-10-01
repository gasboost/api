# @gasboost/gemini

Google Apps Script friendly Gemini API client.

## Install

```sh
pnpm add @gasboost/gemini
```

## Usage

```ts
import { Gemini } from "@gasboost/gemini";

const gemini = new Gemini({ apiKey: "YOUR_GEMINI_API_KEY" });

const interaction = gemini.interactions.create({
  model: "gemini-3.8-flash",
  input: "Hello",
});
```

For Node-based tests, inject a `UrlFetchApp` compatible fetcher:

```ts
import { NodeUrlFetchApp } from "@gasboost/fake-node";
import { Gemini } from "@gasboost/gemini";

const gemini = new Gemini({
  apiKey: process.env.GEMINI_API_KEY ?? "",
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

Integration tests call the real Gemini API and require `packages/gemini/.env`:

```sh
GEMINI_API_KEY=...
pnpm test:integration
```
