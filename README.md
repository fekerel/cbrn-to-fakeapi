# API Tests (Fake API)

API seviyesinde testleri Mocha + TypeScript ile çalıştırmak için bir test projesi. Fake API (json-server tabanlı) üzerinde çalışır.

## Gereksinimler
- Fake API sunucusu (http://localhost:8000) — swagger/OpenAPI: `http://localhost:8000/openapi.json`

## Kurulum
```bash
npm install
```

## Hızlı Başlangıç

- Testleri çalıştır:
```bash
yarn run runner
```

## Önemli Script’ler
- `openapi:fetch`: OpenAPI JSON’ını `./openapi.json` olarak indirir. AI/araçlar için güncel şema sağlar.
- `runner`: Mocha’yı TypeScript ile çalıştırır, `fake-api-tests/**/*.ts` altında tüm testleri yürütür ve bootstrap’i yükler.


## Klasör Yapısı (özet)
- `fake-api-tests/` — Mocha test dosyaları (TS)
  - `bootstrap.ts` — Reset ve global hook’lar
  - `*.spec.ts` - Test dosyaları
- `src/api/fakeApi/*Service.ts` — Testlerde kullanılan service katmanı
- `tools/fetch-openapi.ts` — `openapi:fetch` script’i

## AI ile Çalışma

### Seçenek 1: Test Yazdırma (Alt Küme)
- `subsetPrompt.txt` dosyasının içeriği prompt olarak verilip API'da belirlenmiş endpoint alt kümesi için testler yazdırılır.

### Seçenek 2: Test Yazdırma (Tüm Endpointler)
- `prompt.txt` dosyasının içeriği prompt olarak verilip tüm endpointler için testler yazdırılır.

### Seçenek 3: Healing (Test Onarımı)
AI'ın "healing" yeteneğini test etmek için kullanılır. Senaryo:

1. **Başlangıç durumu**: `healing` branch'inde önceden yazılmış ve pass eden testler bulunur
2. **Breaking change**: Server, API değişikliklerinin aktif olduğu modda çalıştırılır
3. **Testler fail eder**: Önceden pass eden testler artık fail olur
4. **AI'a healing yaptırılır**: `healingPrompt.txt` içeriği prompt olarak verilir

AI, `npm run openapi:fetch-isSelect` komutuyla güncel OpenAPI spec'ini alarak testleri yeni API kontratına göre düzeltir.

## Branch'ler

| Branch | Açıklama |
|--------|----------|
| `main` | Testlerin yazılı olmadığı temiz yapı (AI test yazdırma deneyleri için) |
| `with-tests` | Halihazırda yazılmış testleri içerir |
| `healing` | Önceden yazılmış ve pass eden testler (AI healing deneyleri için) |