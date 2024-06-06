export function formatPrice(price: number) {
    const reais = Math.floor(price);
    const centavos = (price-reais).toFixed(2);
    return `R$${reais},${centavos.split('.')[1]}`;
};

export function formatPricePerMinute (pricePerMin: number, minutes: number) {
    return formatPrice(pricePerMin*minutes);
}
