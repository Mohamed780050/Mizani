/**
 * Maps a Dodo Payments product ID to the internal plan slug.
 * Only two tiers: "free" (default) and "pro".
 */
export function resolveSlugFromProductId(
  productId?: string | null
): "free" | "pro" {
  if (!productId) return "free";
  if (productId === process.env.DODO_PRO_PRODUCT_ID) return "pro";
  return "free";
}
