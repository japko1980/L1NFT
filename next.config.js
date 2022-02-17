const { ContractFunction } = require("hardhat/internal/hardhat-network/stack-traces/model")

module.exports = {
  reactStrictMode: true,
 
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  },

}
