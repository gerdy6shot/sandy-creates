// Published USD prices from https://www.spicegurl.store/, verified 2026-10-23.
// Product descriptions/options on that page do not specify net size or preorder fulfillment dates.
export const preorderCatalog: Record<string, { price: number; size: string | null }> = {
  sofridobo: { price: 1200, size: null },
  'sol-shine': { price: 1000, size: null },
  'yardie-glaze': { price: 1400, size: null },
};
