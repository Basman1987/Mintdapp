import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ProjectInfo = ({ contractAddress }: { contractAddress: string }) => {
  return (
    <Card className="bg-gray-800 mt-8">
      <CardHeader>
        <CardTitle>About the Project</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          This is a unique NFT collection on the Cronos blockchain. Each NFT is individually crafted and provides
          exclusive benefits to holders.
        </CardDescription>
        <div className="mt-4">
          <h3 className="font-bold">Contract Details:</h3>
          <p>Address: {contractAddress}</p>
          <a
            href={`https://cronoscan.com/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            View on Explorer
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectInfo

