import axios from "axios";
import fs from "fs";
import path from "path";

function getArg(name: string, def?: string) {
  const idx = process.argv.findIndex(a => a === `--${name}` || a.startsWith(`--${name}=`));
  if (idx === -1) return def;
  const a = process.argv[idx];
  if (a.includes("=")) return a.split("=")[1];
  return process.argv[idx + 1] ?? def;
}

const url = getArg("url", process.env.OPENAPI_URL || "http://localhost:8000/openapi.json")!;
const out = getArg("out", process.env.OPENAPI_OUT || "./openapi.json")!;
const retries = Number(getArg("retries", "5"));
const delayMs = Number(getArg("delay", "1000"));
const timeoutMs = Number(getArg("timeout", "8000"));

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function run() {
  let lastErr: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[openapi] GET ${url} (attempt ${attempt}/${retries})`);
      const res = await axios.get(url, { timeout: timeoutMs });
      const data = res.data;

      // basit doğrulama
      if (!data || (typeof data !== "object")) throw new Error("Response is not JSON");
      if (!("openapi" in data) && !("swagger" in data)) throw new Error("Not an OpenAPI/Swagger document");

      const outPath = path.resolve(out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");

      // meta bilgi
      const meta = {
        fetchedAt: new Date().toISOString(),
        url,
        status: res.status,
        etag: res.headers["etag"] || null,
        contentType: res.headers["content-type"] || null
      };
      fs.writeFileSync(outPath.replace(/\.json$/i, ".meta.json"), JSON.stringify(meta, null, 2), "utf8");

      console.log(`[openapi] Saved to ${outPath}`);
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`[openapi] fetch failed: ${err instanceof Error ? err.message : err}`);
      if (attempt < retries) await sleep(delayMs);
    }
  }
  console.error("[openapi] giving up after retries");
  throw lastErr;
}

run().catch(err => {
  process.exitCode = 1;
});