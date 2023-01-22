export const plans = {
  tier1:
    process.env.NODE_ENV === 'development'
      ? 'price_1Lc1WiLPakXEuKcnVSOx0jtw'
      : 'price_1LtOTvLPakXEuKcnyPOmETux',
  tier2:
    process.env.NODE_ENV === 'development'
      ? 'price_1Lc1l2LPakXEuKcn3JGCiRFE'
      : 'price_1LtOU4LPakXEuKcnUFAsI3Yr',
  tier3:
    process.env.NODE_ENV === 'development'
      ? 'price_1LpIRZLPakXEuKcnk2O4yrEq'
      : 'price_1LtOU9LPakXEuKcnxqPU1DcG',
};
