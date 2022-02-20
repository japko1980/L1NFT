import axios from 'axios'

import { ethers } from 'ethers'

import { nftmarketaddress } from '../config'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export const getMarketContract = ({
  signer,
} = {}) => {

  const _signer = signer || new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")

  return new ethers.Contract(nftmarketaddress, Market.abi, _signer)
}