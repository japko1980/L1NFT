import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { getMarketContract } from './getMarketContract'

export const getMyCreatedItems = async () => {

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  })

  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const marketContract = getMarketContract({
    signer
  })

  const items = await marketContract.fetchItemsCreated()

  return items;
}