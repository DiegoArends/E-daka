const EXCHANGE_RATE = 36.50; // Mock rate BS/USD

export const formatUSD = (cents) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
};

export const formatBS = (cents) => {
  const bsAmount = (cents / 100) * EXCHANGE_RATE;
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES'
  }).format(bsAmount);
};

export const getExchangeRate = () => EXCHANGE_RATE;
