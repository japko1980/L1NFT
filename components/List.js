import { useRouter } from 'next/router'


import { Item } from '../components/Item'

import { buyNft } from '../lib/buyNft'

export const List = ({
  items,
  loadItems,
  hideBuy,
}) => {

  const router = useRouter();

  return(
  <div className="flex justify-center">
    <div className="px-4" style={{ maxWidth: '1600px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 pt-4">
        {
          items.map((nft, i) =>
          <Item
            list
            key={i}
            item={nft}
            buyNft={!hideBuy && (() => buyNft({ nft, onSuccess: () => loadItems() }))}
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
