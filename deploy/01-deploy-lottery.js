const { network, ethers } = require('hardhat')
const { networkConfig } = require('../helper-hardhat-conifg')

const FUND_AMOUNT = "1000000000000000000000"

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorAddress, subscriptionId
    if (chainId === 31337) {
        const vrfCoordinatorMock = await ethers.getContract('VRFCoordinatorV2Mock')
        vrfCoordinatorAddress = vrfCoordinatorMock.address
        const txRes = await vrfCoordinatorMock.createSubscription()
        const txReceipt = await txRes.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        await vrfCoordinatorMock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    const arguments = [
        vrfCoordinatorAddress,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        subscriptionId,
        networkConfig[chainId].raffleEntranceFee,
        networkConfig[chainId].keepersUpdateInterval
    ]

    const waitConfirmations = chainId === 31337 ? 1 : 6

    log('-------------------')
    log('Deploying the raffle contract')
    await deploy('Raffle', {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitConfirmations
    })
    log('Contracts deployed!   ')
}

module.exports.tags = ['all', 'lottery']