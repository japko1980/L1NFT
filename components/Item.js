import { useEffect, useState, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { ContentBox } from './ContentBox'
import { Molecule } from './Molecule'

export const Item = ({
  children,
  item: {
    getData,
    ...item
  },
  innerRef,
  buyNft,
  onClick,
  onTools,
  onVR,
}) => {

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const [ data, setData ] = useState();

  useEffect(() => {
    if (!inView || data) {
      return;
    }
    
    
    (async () => {
      setData({
        ...item,
        ...(await getData()),
      })
    })()
  }, [ Boolean(inView) ])

  return(
  <div className="border shadow rounded-xl overflow-hidden" ref={ref}>
  <ContentBox onClick={onClick}>
    {data && <Molecule src={data?.image}/>}
  </ContentBox>
  <div className="p-4 bg-black">
    <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded" onClick={onTools}>Tools</button>
    <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded float-right" onClick={onVR}>VR</button>
  </div>
  <div className="p-4">
    <p style={{ height: '64px' }} className="text-2xl font-semibold">{data?.name}</p>
    <div style={{ height: '70px', overflow: 'hidden' }}>
      <p className="text-gray-400">{data?.description}</p>
    </div>
  </div>
  <div className="p-4 bg-black">
    <p className="text-2xl mb-4 font-bold text-white">{data?.price} L1</p>
    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(data)}>Buy</button>
  </div>

  </div>
  )
}
