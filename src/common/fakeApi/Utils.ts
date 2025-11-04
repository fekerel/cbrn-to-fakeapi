const rand = (n = 4) =>
  Math.floor(Math.random() * Math.pow(10, n)).toString().padStart(n, "0");

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