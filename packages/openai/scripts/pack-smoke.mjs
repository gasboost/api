import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";

const packageDir = new URL("..", import.meta.url).pathname;
const packDir = mkdtempSync(join(tmpdir(), "gasboost-openai-pack-"));
const consumerDir = mkdtempSync(join(tmpdir(), "gasboost-openai-consumer-"));

try {
  const tarballName = execFileSync(
    "pnpm",
    ["pack", "--pack-destination", packDir],
    {
      cwd: packageDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    },
  )
    .trim()
    .split("\n")
    .at(-1);

  if (tarballName === undefined || tarballName.length === 0) {
    throw new Error("pnpm pack did not produce a tarball name");
  }

  writeFileSync(
    join(consumerDir, "package.json"),
    JSON.stringify({ private: true }, null, 2),
  );

  const tarballPath = isAbsolute(tarballName)
    ? tarballName
    : join(packDir, tarballName);

  execFileSync("pnpm", ["add", tarballPath], {
    cwd: consumerDir,
    stdio: "inherit",
  });
  execFileSync(
    "node",
    [
      "-e",
      'const api = require("@gasboost/openai"); if (typeof api.OpenAI !== "function" || typeof api.OpenAIApiError !== "function") process.exit(1);',
    ],
    {
      cwd: consumerDir,
      stdio: "inherit",
    },
  );
} finally {
  rmSync(packDir, { recursive: true, force: true });
  rmSync(consumerDir, { recursive: true, force: true });
}
