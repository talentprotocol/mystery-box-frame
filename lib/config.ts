export const config = {
  thirdweb: {
    chainId: Number(process.env.CHAIN_ID),
    engine: {
      url: process.env.THIRDWEB_ENGINE_URL,
      wallet: process.env.THIRDWEB_ENGINE_WALLET,
      accessToken: process.env.THIRDWEB_ACCESS_TOKEN,
    },
  },
};
