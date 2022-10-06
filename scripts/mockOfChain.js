const { ethers, network } = require('hardhat')

async function mockUpkeep() {
    const raffleContract = await ethers.getContract('Raffle')
    const calldata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    const { upkeepNeeeded } = await raffleContract.callStatic.checkUpkeep(calldata)
    console.log(upkeepNeeeded)
    if (upkeepNeeeded) {
        const vrfCoordinator = await ethers.getContract('VRFCoordinatorV2Mock')
        const txRes = await raffleContract.performUpkeep(calldata)
        const txReceipt = await txRes.wait(1)
        const requestId = txReceipt.events[1].args.requestId
        await vrfCoordinator.fulfillRandomWords(requestId, raffleContract.address)
        const recentWinner = await raffleContract.getLastWinner()
        console.log(`Recent winner: ${recentWinner}`)
    } else {
        console.log('No upkeep needed')
    }
}

network.config.chainId == 31337 && mockUpkeep()