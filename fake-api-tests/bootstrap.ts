import { stateService } from "@/api/fakeApi/StateService";
import { writeFileSync, mkdirSync, readFileSync, existsSync, unlinkSync } from "fs";
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

// Clear previous coverage artifacts at the very beginning of the run
before(function () {
  try {
    const outDir = path.resolve(process.cwd(), "coverage");
    const outFile = path.join(outDir, "summary.json");
    const errFile = path.join(outDir, "untested_endpoints.txt");
    if (existsSync(outFile)) unlinkSync(outFile);
    if (existsSync(errFile)) unlinkSync(errFile);
    mkdirSync(outDir, { recursive: true });
    // eslint-disable-next-line no-console
    console.log("[bootstrap] cleared previous coverage artifacts");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[bootstrap] could not clear previous coverage artifacts", e);
  }
});

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

    // Build OpenAPI-based endpoint coverage (tested/untested)
    let openapiSummary: any = undefined;
    try {
      const openapiPath = path.resolve(process.cwd(), "openapi.json");
      const openapiRaw = readFileSync(openapiPath, { encoding: "utf8" });
      const openapi = JSON.parse(openapiRaw);

      type OAEndpoint = { method: string; path: string; regex: RegExp };
      const oaEndpoints: OAEndpoint[] = [];

      const toRegex = (p: string) => new RegExp("^" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{[^}]+\\\}/g, "[^/]+") + "$");

      const PATH_METHODS = ["get", "post", "put", "patch", "delete"];
      if (openapi && openapi.paths) {
        for (const p of Object.keys(openapi.paths)) {
          const obj = openapi.paths[p] || {};
          for (const m of PATH_METHODS) {
            if (obj[m]) {
              oaEndpoints.push({ method: m.toUpperCase(), path: p, regex: toRegex(p) });
            }
          }
        }
      }

      // Normalize recorded calls (strip query) and count hits per OA endpoint
      const hitCounts: Record<string, number> = {};
      const testedSet: Set<string> = new Set();
      for (const c of calls) {
        const method = (c.method || '').toUpperCase();
        if (!method) continue;
        const raw = (c.url || '');
        const pathOnly = raw.split('?')[0];
        // Find matching OA endpoint by regex
        const match = oaEndpoints.find(ep => ep.method === method && ep.regex.test(pathOnly));
        if (match) {
          const key = `${match.method} ${match.path}`;
          testedSet.add(key);
          hitCounts[key] = (hitCounts[key] || 0) + 1;
        }
      }

      const allKeys = oaEndpoints.map(ep => `${ep.method} ${ep.path}`);
      const untested = allKeys.filter(k => !testedSet.has(k)).map(k => {
        const [method, ...rest] = k.split(' ');
        return { method, path: rest.join(' ') };
      });

      openapiSummary = {
        totalDefined: oaEndpoints.length,
        testedCount: testedSet.size,
        untestedCount: untested.length,
        untested,
        hitCounts: Object.entries(hitCounts).map(([k, count]) => {
          const [method, ...rest] = k.split(' ');
          return { method, path: rest.join(' '), count };
        })
      };
    } catch (e) {
      // ignore openapi coverage if file is missing or invalid
      openapiSummary = { error: "openapi.json not available or invalid" };
    }

    // Build a human-friendly snapshot to also persist into summary.json
    let openapiHuman: any = undefined;
    if (openapiSummary && !(openapiSummary as any).error) {
      const { totalDefined, testedCount, untestedCount } = openapiSummary as any;
      const untested = (openapiSummary as any).untested || [];
      const untestedPreview = Array.isArray(untested) ? untested.slice(0, 10) : [];
      openapiHuman = { totalDefined, testedCount, untestedCount, untestedPreview };
    }

    const summary = {
      totalCalls: calls.length,
      uniqueEndpoints: Object.keys(unique).length,
      endpoints: Object.entries(unique).map(([k, count]) => ({ endpoint: k, count })),
      byFile,
      testsWithTitles,
      openapi: openapiSummary,
      openapiHuman,
    };

    writeFileSync(outFile, JSON.stringify(summary, null, 2), { encoding: "utf8" });
    // eslint-disable-next-line no-console
    console.log(`[bootstrap] coverage summary written to ${outFile}`);

    // Human-friendly console summary for quick visibility
    if (summary.openapi && !summary.openapi.error) {
      const { totalDefined, testedCount, untestedCount, untested } = summary.openapi as any;
      // eslint-disable-next-line no-console
      console.log(`[bootstrap] OpenAPI endpoints: total=${totalDefined}, tested=${testedCount}, untested=${untestedCount}`);
      if (Array.isArray(untested) && untested.length > 0) {
        const preview = untested.slice(0, 10).map((u: any) => `${u.method} ${u.path}`).join("\n  - ");
        // eslint-disable-next-line no-console
        console.log(`[bootstrap] Untested (first ${Math.min(10, untested.length)} of ${untested.length}):\n  - ${preview}`);
        // eslint-disable-next-line no-console
        console.log(`[bootstrap] See full list in ${outFile}`);
      }
    }
    // Optionally enforce that all OpenAPI endpoints are tested. Set FAIL_ON_UNTESTED=true (or '1') in the environment
    // to make the test run fail when any endpoint from openapi.json is untested.

    const failOnUntested = "false";

    try {
      const failFlag = (process.env.FAIL_ON_UNTESTED || failOnUntested || "").toLowerCase();
      if ((failFlag === '1' || failFlag === 'true') && openapiSummary && Array.isArray(openapiSummary.untested) && openapiSummary.untested.length > 0) {
        const list = openapiSummary.untested.map((u: any) => `${u.method} ${u.path}`).join('\n');
        // write a short file for CI visibility
        try {
          const errFile = path.join(outDir, "untested_endpoints.txt");
          writeFileSync(errFile, list, { encoding: "utf8" });
        } catch (e) {
          // ignore write errors
        }
        throw new Error(`[bootstrap] FAIL_ON_UNTESTED is set and ${openapiSummary.untested.length} endpoint(s) are untested:\n${list}`);
      }
    } catch (e) {
      // rethrow so Mocha marks the run as failed
      throw e;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[bootstrap] failed to write coverage summary", err);
  }
});