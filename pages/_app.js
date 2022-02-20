
import '../styles/globals.css'

import Link from 'next/link'


function Marketplace({ Component, pageProps }) {
  return (
    <div className="bg-black">
      <nav className="text-center">
        <h1 className="text-center text-white pt-6 text-3xl">MOLNFT</h1>
        <h2 className="text-center text-white">GenesisL1 blockchain</h2>
        <div className="mt-4">
          <Link href="/">
            <a className="mr-4 text-white text-xl">
              Gallery
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-white text-xl">
              Create
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-white text-xl">
              My
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-white text-xl">
              Minted
            </a>
          </Link>
          <Link href="/about">
            <a className="mr-6 text-white text-xl">
              About
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace
