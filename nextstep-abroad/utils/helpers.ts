/**
 * Utility / helper functions used across the app.
 */

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a price number to a USD currency string.
 * e.g. 1234.5 → "$1,234.50"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Truncates a string to a given length and appends "...".
 */
export function truncate(str: string, maxLength = 80): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

/**
 * Returns a gender badge color for MUI Chip.
 */
export function genderColor(
  gender: string
): "primary" | "secondary" | "default" {
  if (gender === "male") return "primary";
  if (gender === "female") return "secondary";
  return "default";
}

/**
 * Calculates the discounted price.
 */
export function discountedPrice(
  price: number,
  discountPercentage: number
): number {
  return parseFloat((price * (1 - discountPercentage / 100)).toFixed(2));
}
