"use client"

import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import type { ReactNode } from "react"
import { InjectedConnector } from "@web3-react/injected-connector"

const injectedConnector = new InjectedConnector({
  supportedChainIds: [25], // Cronos mainnet
})

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export default function Web3ProviderWrapper({ children }: { children: ReactNode }) {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
}

export { injectedConnector }

