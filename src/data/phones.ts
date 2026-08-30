export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeNationalNumber(value: string): string {
  return digitsOnly(value).replace(/^0+/, "");
}

export function buildE164(dialCode: string, nationalNumber: string): string {
  const cc = digitsOnly(dialCode);
  const national = normalizeNationalNumber(nationalNumber);
  if (!cc || !national) return "";
  return `+${cc}${national}`;
}

export function isValidE164(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

function groupNational(national: string): string {
  if (national.length === 9) {
    return `${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  }
  return national.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function formatPhonePreview(
  dialCode: string,
  nationalNumber: string
): string {
  const national = normalizeNationalNumber(nationalNumber);
  if (!national) return "";
  return `${dialCode} ${groupNational(national)}`;
}

export function parseE164CountryCode(e164: string): string {
  if (!e164.startsWith("+")) return "";
  const cc1 = e164.slice(1, 2);
  if (cc1 === "1" || cc1 === "7") return cc1;
  return e164.slice(1, 3);
}