require('dotenv').config()
const fs = require('fs')
const { ethers, network } = require('hardhat')

const FRONT_END_ADDRESSES_FILE = '../smart-lottery-front-end/constants/contractAddresses.json'
const FRONT_END_ABI_FILE = '../smart-lottery-front-end/constants/abi.json'

module.exports = async function () {
    if (!process.env.UPDATE_FRONT_END) return
    console.log('Updating the front end...')
    updateContractAddresses()
    updateAbi()
}

async function updateContractAddresses() {
    const raffleContract = await ethers.getContract('Raffle')
    const chainId = network.config.chainId
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf-8'))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffleContract.address)) {
            currentAddresses[chainId].push(raffleContract.address)
        }
    } else {
        currentAddresses[chainId] = [raffleContract.address]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateAbi() {
    const raffleContract = await ethers.getContract('Raffle')
    fs.writeFileSync(FRONT_END_ABI_FILE, raffleContract.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ['all', 'frontend']