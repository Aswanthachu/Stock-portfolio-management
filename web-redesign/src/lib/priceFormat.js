export function formatPrice({price, currencyCode, locale}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}