import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import { useRouter } from 'next/router'

import { Item } from '../components/Item'

import {
  nftaddress, nftmarketaddress
} from '../../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function NFTView() {

  const router = useRouter();

  const { tokenId } = router.query

  const [nft, setNft] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {
    loadNFT()
  }, [ tokenId ])

  async function loadNFT() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const found = data.find(item => item.itemId.toNumber() === parseInt(tokenId))

    found && setNft({
      ...found,
      price: ethers.utils.formatUnits(found.price.toString(), 'ether'),
      getData: async () => {
        const tokenUri = await tokenContract.tokenURI(tokenId)
        try {
          return (await axios.get(tokenUri)).data
        } catch(error) {
          return {}
        }
      },
    });

    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFT()
  }
  
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="pt-4">
          {nft &&
          <Item
            item={nft}
            buyNft={buyNft}
            onClick={() => router.push(`/nft/${nft.itemId}`)}
            onTools={() => router.push(`/nft/${nft.itemId}/tools`)}
            onVR={() => router.push(`/nft/${nft.itemId}/vrtools`)}
          />}
        </div>
      </div>
    </div>
  )
}
