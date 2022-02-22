import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { useRouter } from 'next/router'

import { List } from '../components/List'

import { getMyCreatedItems as getItems } from '../lib/getMyCreatedItems'
import { decorateItems } from '../lib/decorateItems'

export default function MyAssets() {

  const router = useRouter();

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {

    const items = await decorateItems(await getItems())

    setNfts(items)
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  
  return (
    <List items={nfts} loadItems={loadNFTs} hideBuy />
  )
}
