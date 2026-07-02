export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const SHIPPING_FLAT_CENTS = 1000;
export const TAX_RATE = 0.08;

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS || subtotalCents === 0
    ? 0
    : SHIPPING_FLAT_CENTS;
}

export function taxFor(subtotalCents: number): number {
  return Math.round(subtotalCents * TAX_RATE);
}
