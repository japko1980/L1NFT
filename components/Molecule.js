import { useRef, useEffect } from 'react'

export const Molecule = ({
  src
}) => {

  const el = useRef()

  useEffect(() => {
    src && (async () => {
      const NGL = await import('ngl')
      const stage = new NGL.Stage(el.current)
      stage.loadFile(src, { ext: 'pdb', defaultRepresentation: true });
    })()
  }, [])
  
  return(
  <div className="image" ref={el} style={{ position: 'absolute',  top: 0, right: 0, bottom: 0, left: 0 }} />
  )
}