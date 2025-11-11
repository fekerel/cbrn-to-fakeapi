import { stateService } from "@/api/fakeApi/StateService";
import { writeFileSync, mkdirSync } from "fs";
import * as path from "path";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function doReset() {
  try {
    await sleep(1000);
    await stateService.resetDb();
    console.log("[bootstrap] reset başarılı");
  } catch (err) {
    console.error("[bootstrap] reset hatası:", err);
    throw err;
  }
}

// Dosya başına (per-file) sadece bir kere çalışacak şekilde kontrol
let lastFile: string | undefined;

// Global coverage bucket
// We record each outgoing HTTP call (method + url) via an axios interceptor hook (see HttpClient.requestConfig)
// and enrich it with current test metadata from this bootstrap.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g: any = globalThis as any;
if (!g.__endpointCoverage) {
  g.__endpointCoverage = [] as Array<{ method?: string; url?: string; file?: string; title?: string }>;
}

beforeEach(async function () {
  // this.timeout erişimi için normal function kullanılıyor
  this.timeout(20000);

  const currentFile = (this.currentTest && (this.currentTest as any).file) || undefined;

  // Eğer test objesinde file yoksa (esnek fallback), ilk çağırıda reset at
  if (!currentFile) {
    if (!lastFile) {
      await doReset();
      lastFile = '__initialized__';
    }
    // still set current test metadata if available
    if (this.currentTest) {
      g.__currentTestFile = undefined;
      g.__currentTestTitle = this.currentTest.title;
    }
    return;
  }

  if (currentFile !== lastFile) {
    await doReset();
    lastFile = currentFile;
  }

  // expose current test metadata for interceptors
  g.__currentTestFile = currentFile;
  g.__currentTestTitle = this.currentTest?.title;
});

after(function () {
  try {
    const outDir = path.resolve(process.cwd(), "coverage");
    mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "summary.json");

    const calls = (g.__endpointCoverage || []) as Array<{ method?: string; url?: string; file?: string; title?: string }>;
    const uniqueKey = (c: { method?: string; url?: string }) => `${(c.method || '').toUpperCase()} ${c.url || ''}`;
    const unique: Record<string, number> = {};
    const byFile: Record<string, Array<string>> = {};

    for (const c of calls) {
      const key = uniqueKey(c);
      unique[key] = (unique[key] || 0) + 1;
      const f = c.file || 'unknown';
      if (!byFile[f]) byFile[f] = [];
      if (!byFile[f].includes(key)) byFile[f].push(key);
    }

    // Extract test title-driven metadata (METHOD PATH - expectation)
    const titleRegex = /^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)\s*-\s*(.+)$/i;
    const testsWithTitles: Array<{ method: string; path: string; expectation: string; file?: string; rawTitle?: string }> = [];
    for (const c of calls) {
      if (c.title) {
        const m = c.title.match(titleRegex);
        if (m) {
          testsWithTitles.push({
            method: m[1].toUpperCase(),
            path: m[2],
            expectation: m[3],
            file: c.file,
            rawTitle: c.title,
          });
        }
      }
    }

    const summary = {
      totalCalls: calls.length,
      uniqueEndpoints: Object.keys(unique).length,
      endpoints: Object.entries(unique).map(([k, count]) => ({ endpoint: k, count })),
      byFile,
      testsWithTitles,
    };

    writeFileSync(outFile, JSON.stringify(summary, null, 2), { encoding: "utf8" });
    // eslint-disable-next-line no-console
    console.log(`[bootstrap] coverage summary written to ${outFile}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[bootstrap] failed to write coverage summary", err);
  }
});