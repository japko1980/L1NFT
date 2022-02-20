import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { useRouter } from 'next/router'

import {
  nftmarketaddress, nftaddress
} from '../config'

import { Item } from '../components/Item'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export const List = ({
  items,
  loadItems,
}) => {

  const router = useRouter();

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
    loadItems()
  }

  return(
  <div className="flex justify-center">
    <div className="px-4" style={{ maxWidth: '1600px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {
          items.map((nft, i) =>
          <Item
            list
            key={i}
            item={nft}
            buyNft={buyNft}
            onClick={() => router.push(`/${nft.itemId}`)}
            onTools={() => router.push(`/${nft.itemId}/tools`)}
            onVR={() => router.push(`/${nft.itemId}/vrtools`)}
          />)
        }
      </div>
    </div>
  </div>
  )
}