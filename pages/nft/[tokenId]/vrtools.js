import { useEffect, useState, useRef } from 'react'

import { ethers } from 'ethers'

import axios from 'axios'

import { useRouter } from 'next/router'


import {
  nftaddress, nftmarketaddress
} from '../../../config'

import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/Market.sol/NFTMarket.json'
import { OneMinusDstAlphaFactor } from 'three'

export default function VRTools() {

  const router = useRouter();
  const el = useRef();

  const { tokenId } = router.query

  const [nft, setNft] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {

    tokenId && (async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const tokenUri = await tokenContract.tokenURI(tokenId)
      const file = (await axios.get(tokenUri)).data
      
      const { data } = await axios.get(file.image);
      //const ext = data.startsWith('HEADER') ? 'pdb' : 'cif';


    })()

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
  
  return (
    <div className="flex justify-center">
      <div className="px-4" ref={el} id="icn3dui" />
    </div>
  )
}
