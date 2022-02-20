import axios from 'axios'

export const getMolFormat = async url => {

  const info = await axios.get(url, {
    headers: {
      'Range': 'bytes=0-63'
    }
  })

  return {
    format: info.data.startsWith('HEADER') ? 'pdb' : 'cif',
    size: parseInt(info.headers['content-range'].split(/\//).pop()),
  }

}