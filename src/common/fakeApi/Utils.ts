const rand = (n = 4) =>
  Math.floor(Math.random() * Math.pow(10, n)).toString().padStart(n, "0");

export function randomInt(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function uniqueEmail(prefix = "test", domain = "example.com") {
  return `${prefix}+${Date.now()}${rand(3)}@${domain}`;
}

export function uniqueId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function timestampIso(date = new Date()) {
  return date.toISOString();
}

export function randomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export function uniquePhone() {
  // simple e.g. "1-202-555-0123" like pattern with randomness
  return `1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    100 + Math.random() * 900
  )}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function randomAmount(min = 1, max = 1000): number {
  const v = Math.random() * (max - min) + min;
  return parseFloat(v.toFixed(2));
}

function pickEnum(values: string[]): string {
  return values[Math.floor(Math.random() * values.length)];
}

// Simple, schema-aligned user body builder (no dynamic OpenAPI load)
// Excludes server-managed fields (id, createdAt, modifiedAt)
export function buildRandomUserBody(overrides: Record<string, unknown> = {}) {
  const body = {
    email: uniqueEmail("user"),
    password: randomPassword(10),
    firstName: `FN_${randomString(5)}`,
    lastName: `LN_${randomString(5)}`,
    role: pickEnum(["superadmin","admin","manager","support","seller","buyer","warehouse"]),
    phone: `+1${rand(3)}${rand(3)}${rand(4)}`,
    status: pickEnum(["active","inactive","pending","banned"]),
    address: {
      street: `${randomInt(10,999)} ${randomString(6)} St`,
      city: `City${randomString(4)}`,
      country: `Country${randomString(3)}`,
      zipCode: `${rand(5)}`,
    },
  };
  return { ...body, ...overrides };
}

// Products
export function buildRandomProductBody(overrides: Record<string, unknown> = {}) {
  const variant = () => ({
    id: `VAR-${randomString(12)}`,
    color: pickEnum(["red","green","blue","black","white","gold","pink","silver"]),
    size: pickEnum(["XS","S","M","L","XL"]),
    price: randomAmount(5, 200),
    stock: randomInt(0, 1000),
  });

  const body = {
    sellerId: null as number | null,
    categoryId: null as number | null,
    name: `Product ${randomString(8)}`,
    description: `${randomString(12)} ${randomString(16)} ${randomString(10)}`,
    price: randomAmount(1, 999),
    stock: randomInt(0, 500),
    variants: [variant(), variant()],
    tags: [pickEnum(["new","sale","featured","premium","exclusive"])],
    status: pickEnum(["active","inactive"]) as "active" | "inactive",
  };
  return { ...body, ...overrides };
}

// Categories
export function buildRandomCategoryBody(overrides: Record<string, unknown> = {}) {
  const body = {
    name: `${pickEnum(["Electronics","Outdoors","Toys","Grocery","Apparel"]) } ${randomString(6)}`,
    description: `${randomString(20)} ${randomString(20)}`,
    parentId: null as number | null,
    status: pickEnum(["active","inactive"]) as "active" | "inactive",
  };
  return { ...body, ...overrides };
}

// Orders
export function buildRandomOrderBody(overrides: Record<string, unknown> = {}) {
  const item = () => ({
    productId: null as number | null,
    variantId: null as string | null,
    quantity: randomInt(1, 5),
    price: randomAmount(1, 100),
  });

  const shipping = {
    street: `${randomInt(10,999)} ${randomString(6)} Ave`,
    city: `City${randomString(4)}`,
    country: pickEnum(["USA","UK","Germany","Turkey","Japan","France"]),
    zipCode: `${rand(5)}`,
  };

  const payment = {
    method: pickEnum(["credit_card","paypal","bank_transfer"]) as "credit_card"|"paypal"|"bank_transfer",
    status: pickEnum(["pending","processing","shipped","delivered","cancelled"]) as "pending"|"processing"|"shipped"|"delivered"|"cancelled",
  };

  const items = [item(), item()];
  const totalAmount = parseFloat(items.reduce((s, it) => s + (it.price as number) * it.quantity, 0).toFixed(2));

  const body = {
    userId: null as number | null,
    items,
    totalAmount,
    shippingAddress: shipping,
    payment,
    status: pickEnum(["pending","failed","cancelled","returned","delivered"]) as "pending"|"failed"|"cancelled"|"returned"|"delivered",
  };
  return { ...body, ...overrides };
}

// Reviews
export function buildRandomReviewBody(overrides: Record<string, unknown> = {}) {
  const body = {
    productId: null as number | null,
    userId: null as number | null,
    rating: randomInt(1, 5),
    comment: `${randomString(12)} ${randomString(16)}.`,
  };
  return { ...body, ...overrides };
}

// Lightweight nested assertion helpers for tests
export function isIsoTimestamp(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime()) && /\d{4}-\d{2}-\d{2}T/.test(value);
}