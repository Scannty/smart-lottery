require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('dotenv').config()

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};
