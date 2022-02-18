
import '../styles/globals.css'

import Link from 'next/link'


function Marketplace({ Component, pageProps }) {
  return (
    <div className="bg-black">
      <nav className="text-center">
        <h1 className="text-center text-white pt-6">MOLNFT</h1>
        <div className="mt-4">
          <Link href="/">
            <a className="mr-4 text-white">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-white">
              Create
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-white">
              My
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-white">
              Minted
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace
