import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { useRouter } from 'next/router'

import { List } from '../components/List'

import { getMyItems as getItems } from '../lib/getMyItems'
import { decorateItems } from '../lib/decorateItems'

import CreateItem from './create-item'

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

    console.log(items)
  }
  
  return (
  <>
    {nfts.length && <List items={nfts} loadItems={loadNFTs} hideBuy /> || ''}
    {!nfts.length &&
    <>
      <div className="flex justify-center py-10">
        <p>You don't own any molecule yet. Feel free to mint a new molecule:</p>
      </div>

      <CreateItem />
    </>
    }
  </>
  )
}
