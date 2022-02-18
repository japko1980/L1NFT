import { useEffect, useState } from 'react'

import styled from 'styled-components'

const BoxWrapper = styled.div`
min-width: 378px;
width: 100%;
padding-bottom: 100%;
position: relative;

& > div {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    margin: auto;
  }
}
`

export const ContentBox = ({
  children,
  item,
  innerRef,
  buyNft,
  ...props
}) => {

  return(
  <BoxWrapper {...props}>
    {children}
  </BoxWrapper>
  )
}
