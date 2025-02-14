import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const WhitelistPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogDescription>
            You are whitelisted! You can now mint NFTs at a reduced price using either CRO or CROFAM tokens.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default WhitelistPopup

