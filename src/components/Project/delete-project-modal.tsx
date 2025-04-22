import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"

interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  projectName?: string
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onDelete,
  projectName
}: DeleteProjectModalProps) {
  
  const handleDelete = () => {
    onDelete()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose()
    }}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {projectName ? `"${projectName}"` : "this project"}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
