
export const calculateDiscount = (regularPrice: number, salePrice: number | null) => {
  if (!salePrice || salePrice >= regularPrice) return 0;
  const discount = ((regularPrice - salePrice) / regularPrice) * 100;
  return Math.round(discount);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};
