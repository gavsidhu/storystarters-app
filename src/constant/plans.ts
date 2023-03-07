export const plans = {
  tier1:
    process.env.NODE_ENV === 'development'
      ? 'price_1Lc1WiLPakXEuKcnVSOx0jtw'
      : 'price_1Mj6RgLPakXEuKcnFYfeeU5F',
  tier2:
    process.env.NODE_ENV === 'development'
      ? 'price_1Lc1l2LPakXEuKcn3JGCiRFE'
      : 'price_1Mj6TILPakXEuKcnXYcjw0AN',
  tier3:
    process.env.NODE_ENV === 'development'
      ? 'price_1LpIRZLPakXEuKcnk2O4yrEq'
      : 'price_1Mj6TZLPakXEuKcnuYzaWAVU',
  free: 'free',
};
