# API Tests (Fake API)

API seviyesinde testleri Mocha + TypeScript ile çalıştırmak için bir test projesi. Fake API (json-server tabanlı) üzerinde çalışır ve testler arasında veritabanını güvenle sıfırlamak için `_admin/reset-db` endpointini kullanır.

## Gereksinimler
- Node.js 18+ ve npm
- Fake API sunucusu (http://localhost:8000) — swagger/OpenAPI: `http://localhost:8000/openapi.json`

## Kurulum
```bash
npm install
```

## Hızlı Başlangıç

- Testleri çalıştır:
```bash
npm run test:fake
```

## Önemli Script’ler
- `openapi:fetch`: OpenAPI JSON’ını `./openapi.json` olarak indirir. AI/araçlar için güncel şema sağlar.
- `test:fake`: Mocha’yı TypeScript ile çalıştırır, `fake-api-tests/**/*.ts` altında tüm testleri yürütür ve bootstrap’i yükler.
- `seed:fake`: Gerekirse veri tabanında veri üretimi tetikleyen komut.

## Test Yaşam Döngüsü ve Reset Stratejisi
- `fake-api-tests/bootstrap.ts` test dosyası, dosya başına (per-file) DB reset mantığı uygular.

## Klasör Yapısı (özet)
- `fake-api-tests/` — Mocha test dosyaları (TS)
  - `bootstrap.ts` — Reset ve global hook’lar
  - `basic*Tests.ts` — örnek CRUD ve akış testleri
- `src/api/fakeApi/*Service.ts` — Testlerde kullanılan service katmanı
  - `StateService.resetDb()` → `POST /_admin/reset-db` bekler ve 204 dönerse başarılı sayar
- `tools/fetch-openapi.ts` — `openapi:fetch` script’i

## Swagger / OpenAPI ile Çalışma
- AI/agent kullanmadan önce güncel Swagger şemasını indirin:
```bash
npm run openapi:fetch
```
- Çıktı `./openapi.json` dosyasına yazılır (ek olarak `openapi.meta.json` meta bilgisi).