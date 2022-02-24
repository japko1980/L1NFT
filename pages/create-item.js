import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import { Molecule } from '../components/Molecule'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  const updatePrice = price => {
    updateFormInput({
      ...formInput,
      price
    })
  }

  const _price = parseInt(formInput.price)

  const priceError = isNaN(_price) || _price < 1 || _price > 10000;

  async function onChange(e) {

    setIsUploading(true);

    const file = e.target.files[0]

    const size = file.size;

    try {
      const added = await client.add(
        file,
        {
          progress: current => {
            console.log(current, size, current/size)
            setProgress(current/size)
          }
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }

    setIsUploading(false);
  }

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) {
      return
    }
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  console.log(progress)

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(String(_price), 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }

  const isValid = (!priceError && formInput.price) && formInput.name && formInput.description && fileUrl

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12" style={{ maxWidth: 800 }}>
        <input 
          placeholder="Title"
          autoFocus
          className="mt-8 border rounded p-4"
          value={formInput.name}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          value={formInput.description}
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="MOLNFT Price in L1 (1-10000 L1)"
          className="mt-2 border rounded p-4"
          value={formInput.price}
          onChange={e => updatePrice(e.target.value)}
        />
        
        {formInput.price && priceError && <small>Price must be between 1 and 10000 L1</small> || ''}
        <small>Creation of MOLNFT is <strong>FREE</strong> (tx #1) and Gallery listing is <strong>50L1</strong> (tx #2).</small>

        <input
          type="file"
          accept=".pdb,.cif"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        <small>Only <strong>.pdb</strong> and <strong>.cif</strong> molecule description files accepted</small>

        {isUploading &&
        <div style={{ position: 'relative', padding: 5 }}>
          &nbsp;
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#333', width: `${progress * 100}%`, height: '100%', zIndex: 0, overflow: 'visible', whiteSpace: 'nowrap', padding: 5 }}>
            Uploading {(progress * 100).toFixed(0)}%...
          </div>
        </div>
        }

        {
          fileUrl && (
          <div>
            <h4 className="text-white">{fileUrl}</h4>
            <div>
              <div style={{ width: 300, height: 300, position: 'relative', display: 'inline-block' }}>
                <Molecule src={fileUrl} />
              </div>
            </div>
          </div>
          )
        }

        <button disabled={!isValid} onClick={createMarket} className={`font-bold mt-4 ${isValid && `bg-pink-500 text-white` || `bg-gray-500 text-gray-400`} rounded p-4 shadow-lg`}>
          Create MOLNFT
        </button>
      </div>
    </div>
  )
}
