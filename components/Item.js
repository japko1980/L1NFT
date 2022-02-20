import { useEffect, useState, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { ContentBox } from './ContentBox'
import { Molecule } from './Molecule'
import { getMolFormat } from '../lib/getMolFormat'

import styled from 'styled-components'

const Actions = styled.div`
display: flex;
& > button {
  flex: 1;
  margin: 0 5px;
  font-size: 12px;
}
`

export const Item = ({
  children,
  list,
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

      const data = await getData();
      const { format , size } = await getMolFormat(data.image)

      setData({
        ...item,
        ...(await getData()),
        format,
        size,
      })
    })()
  }, [ Boolean(inView) ])

  const show = data && (data.format !== 'cif' || data?.size < 5_000_000)

  return(
  <div className="border shadow rounded-xl overflow-hidden" ref={ref}>
  <ContentBox>
    {data && <Molecule list={list} src={data?.image}/>}
  </ContentBox>
  <div className="p-4">
    <p style={{ height: '64px' }} className="text-2xl font-semibold">{data?.name}</p>
    <div style={{ height: '70px', overflow: 'hidden' }}>
      <p className="text-white lowercase text-justify">{data?.description}</p>
    </div>
  </div>
  <div className="p-4 bg-black">
    <p className="text-2xl mb-4 font-bold text-white">{data?.price} L1</p>
    
    <Actions>
      <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => buyNft(data)}>Accio</button>
      {onClick && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onClick}>View</button>}
      {show && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onTools}>Analysis</button>}
      {show && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onVR}>Bioverse</button>}
    </Actions>

  </div>

  </div>
  )
}
