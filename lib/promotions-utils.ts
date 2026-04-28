import type { Product } from './types';
import type { Promotion } from '@/actions/promotions';

/**
 * Given a list of active promotions and a product, finds the best applicable
 * promotion (product-specific > category-specific > global) and returns it.
 */
export function findBestPromotion(
  product: Product,
  activePromotions: Promotion[]
): Promotion | null {
  const now = new Date();
  // Sort by created_at DESC so the most recent one comes first
  const valid = activePromotions
    .filter((p) => p.is_active && new Date(p.end_date) > now)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // 1. Product-specific (Most recent)
  const productPromo = valid.find(
    (p) => p.apply_to === 'product' && p.product_id === product.id
  );
  if (productPromo) return productPromo;

  // 2. Category-specific (Most recent)
  const categoryPromo = valid.find(
    (p) => p.apply_to === 'category' && p.category === product.category
  );
  if (categoryPromo) return categoryPromo;

  // 3. Global (Most recent)
  const globalPromo = valid.find((p) => p.apply_to === 'all');
  if (globalPromo) return globalPromo;

  return null;
}

/**
 * Applies the matching promotion to a product.
 * Per requirements:
 * 1. Always calculates from original 'price'.
 * 2. Overrides any previous/manual discount (salePrice).
 */
export function applyPromotionToProduct(
  product: Product,
  activePromotions: Promotion[]
): Product & { activePromotion: Promotion | null } {
  const promo = findBestPromotion(product, activePromotions);

  if (!promo) {
    return { ...product, activePromotion: null };
  }

  const discountedPrice = parseFloat(
    (product.price * (1 - promo.discount_percentage / 100)).toFixed(2)
  );

  // If a promotion exists, it takes precedence over manual salePrice
  return {
    ...product,
    salePrice: discountedPrice,
    activePromotion: promo,
  };
}

/**
 * Applies promotions to an array of products.
 */
export function applyPromotionsToProducts(
  products: Product[],
  activePromotions: Promotion[]
): (Product & { activePromotion: Promotion | null })[] {
  return products.map((p) => applyPromotionToProduct(p, activePromotions));
}
