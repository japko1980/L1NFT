import { useRef, useEffect } from 'react'
import axios from 'axios'

export const Molecule = ({
  src
}) => {

  const el = useRef()

  useEffect(() => {
    src && (async () => {
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
  <div className="image" ref={el} style={{ position: 'absolute',  top: 0, right: 0, bottom: 0, left: 0 }} />
  )
}