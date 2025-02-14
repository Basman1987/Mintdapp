import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cronos NFT Mint Dapp",
  description: "Mint your NFTs on the Cronos EVM chain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'