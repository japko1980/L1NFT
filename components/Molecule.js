import { useRef, useEffect, useState } from 'react'
import axios from 'axios'

import { getMolFormat } from '../lib/getMolFormat'

export const Molecule = ({
  list,
  src,
}) => {

  const el = useRef()

  const [ error, setError ] = useState()

  useEffect(() => {
    src && (async () => {

      const { format , size } = await getMolFormat(src)

      if (list && size > 1_000_000) {
        return setError('Preview is too big for list page')
      }

      const NGL = await import('ngl')
      const stage = new NGL.Stage(el.current)
      const { data } = await axios.get(src);

      const ext = data.startsWith('HEADER') ? 'pdb' : 'cif';
      stage.loadFile(
        new Blob([ data ], { type: 'text/plain'}),
        {
          ext,
          defaultRepresentation: true
        }
      );
    })()
  }, [])
  
  return(
  <>
    {!error && <div className="image" ref={el} style={{ position: 'absolute',  top: 0, right: 0, bottom: 0, left: 0 }} />}
    {error && <div className="image" ref={el} style={{ position: 'absolute',  top: 0, right: 0, bottom: 0, left: 0 }}>{error}</div>}
  </>
  )
}