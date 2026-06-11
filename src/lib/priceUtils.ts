import { Language } from '../translations';

export function formatPrice(price: number, currency: 'USD' | 'EGP' = 'USD', lang: Language = 'ar'): string {
  if (currency === 'EGP') {
    return lang === 'ar' ? `${price.toLocaleString('ar-EG')} ج.م` : `${price.toLocaleString('en-US')} EGP`;
  }
  // Default to USD
  return lang === 'ar' ? `$${price.toLocaleString('ar-EG')}` : `$${price.toLocaleString('en-US')}`;
}
