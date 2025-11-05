import { stateService } from "@/api/fakeApi/StateService";

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
    return;
  }

  if (currentFile !== lastFile) {
    await doReset();
    lastFile = currentFile;
  }
});