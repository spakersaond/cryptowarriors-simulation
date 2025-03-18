import { client } from '../client'
import { Link } from 'react-router-dom'
import { ConnectButton, lightTheme, useActiveAccount } from 'thirdweb/react'
// import Image from 'next/image'
// import LOGO_Maroon from '../../public/LOGO_Maroon'
import { createWallet, inAppWallet } from 'thirdweb/wallets'
import './styles.css'

const Navbar = () => {
  const account = useActiveAccount()
  const wallets = [createWallet('io.metamask')]

  return (
    <nav className="bg-slate-100 border-b-2 border-gray-700 navbar-cs motion-preset-bounce">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div> */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                src="/LOGO_Maroon.png"
                alt="Crypto Warriors"
                width={128}
                height={128}
                className=""
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link to={'/'}>
                  <p className="rounded-md px-3 py-2 text-lg font-medium text-slate-700 active:text-red-900 hover:underline hover:text-red-500 hover:motion-preset-fade active:motion-preset-expand">
                    Fundraising
                  </p>
                </Link>

                {(account &&
                  account.address ===
                    '0x12891D99bf48a07CAFbD682f38A5595414728be5') ||
                (account &&
                  account.address ===
                    '0x1871881ECF3415eE2F790b78f69678B8e3448624') ? (
                  <Link to={`/dashboard/${account?.address}`}>
                    <p className="rounded-md px-3 py-2 text-lg font-medium text-slate-700 active:text-red-900 hover:underline hover:text-red-500 hover:motion-preset-fade active:motion-preset-expand">
                      Dashboard
                    </p>
                  </Link>
                ) : (
                  ''
                )}
                <Link to={'/instructions'}>
                  <p className="rounded-md px-3 py-2 text-lg font-medium text-slate-700 active:text-red-900 hover:underline hover:text-red-500 hover:motion-preset-fade active:motion-preset-expand">
                    Instructions
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ConnectButton
              client={client}
              theme={lightTheme()}
              detailsButton={{
                style: {
                  maxHeight: '250px',
                },
              }}
              wallets={wallets}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
