#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { type QubicEvent, QubicEventAdapter } from "../src";

type Args = {
  input: string;
  output?: string;
};

const parseArgs = (): Args => {
  const args = process.argv.slice(2);
  const result: Args = { input: "" };
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    const value = args[i + 1];
    if (key === "--input" && value) {
      result.input = value;
      i += 1;
    } else if (key === "--output" && value) {
      result.output = value;
      i += 1;
    }
  }
  if (!result.input) {
    throw new Error("--input <file> is required");
  }
  return result;
};

const main = () => {
  const { input, output } = parseArgs();
  const adapter = new QubicEventAdapter();
  const filePath = path.resolve(process.cwd(), input);
  const raw = readFileSync(filePath, "utf-8");
  const events: QubicEvent[] = JSON.parse(raw);
  const normalized = events.map((event) => adapter.normalize(event));

  const json = JSON.stringify(normalized, null, 2);
  if (output) {
    const outPath = path.resolve(process.cwd(), output);
    writeFileSync(outPath, json);
    console.log(`Wrote ${normalized.length} normalized actions to ${outPath}`);
  } else {
    console.log(json);
  }
};

main();
