import { Twitter, DiscIcon as Discord, Globe } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2023 My NFT Collection. All rights reserved.</p>
        <p>Made with ❤️ by BASMAN</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="https://twitter.com/your-twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://discord.gg/your-discord"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            <Discord size={24} />
          </a>
          <a
            href="https://your-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            <Globe size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

