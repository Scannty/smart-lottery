const { network } = require('hardhat')

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (network.config.chainId == 31337) {
        log('Local network detected, deploying mocks...')
        await deploy('VRFCoordinatorV2Mock', {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true
        })
        log('Mocks deployed!')
    }
}

module.exports.tags = ['all', 'mocks']