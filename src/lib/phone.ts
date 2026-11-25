/**
 * Normaliza un número telefónico mexicano al formato internacional +52XXXXXXXXXX.
 * Acepta 10 dígitos nacionales, 52 + 10 dígitos, +52 + 10 dígitos o 521 / +521 + 10 dígitos.
 * Devuelve `null` si el número no corresponde a un teléfono mexicano válido de 10 dígitos.
 */
export function normalizeMexicanWhatsApp(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Conservamos únicamente los dígitos para validar la longitud real
  const digits = trimmed.replace(/\D/g, "");

  let nationalTenDigits: string | null = null;
  if (digits.length === 10) {
    nationalTenDigits = digits;
  } else if (digits.length === 12 && digits.startsWith("52")) {
    nationalTenDigits = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith("521")) {
    nationalTenDigits = digits.slice(3);
  }

  if (!nationalTenDigits || !/^[1-9]\d{9}$/.test(nationalTenDigits)) {
    return null;
  }

  return `+52${nationalTenDigits}`;
}

/**
 * Normaliza un teléfono general mexicano; si cumple 10 dígitos mexicanos devuelve +52XXXXXXXXXX,
 * o conserva dígitos con prefijo '+' si ya tiene formato internacional válido (10-15 dígitos).
 */
export function normalizePhone(raw: string): string | null {
  const mexican = normalizeMexicanWhatsApp(raw);
  if (mexican) return mexican;

  const digits = raw.trim().replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

/**
 * Extrae únicamente dígitos para construir enlaces https://wa.me/<digits>.
 */
export function toWhatsAppDigits(normalizedWhatsApp: string): string {
  return normalizedWhatsApp.replace(/\D/g, "");
}
