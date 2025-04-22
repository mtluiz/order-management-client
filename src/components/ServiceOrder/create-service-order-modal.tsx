import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { serviceOrderSchema, ServiceOrderFormValues } from "../../schemas/serviceOrderSchema"

interface CreateServiceOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ServiceOrderFormValues) => void
  projectId: string
}

export function CreateServiceOrderModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
}: CreateServiceOrderModalProps) {
    
  const form = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      name: "",
      category: "",
      description: null,
      projectId: projectId || "",
      isApproved: false
    }
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        category: "",
        description: null,
        projectId: projectId || "",
        isApproved: false
      })
    }
  }, [isOpen, projectId, form])

  React.useEffect(() => {
    if (projectId) {
      form.setValue("projectId", projectId)
    }
  }, [projectId, form])

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
    form.reset()
    onClose()
  })

  const handleCancel = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCancel()
    }}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Service Order</DialogTitle>
          <DialogDescription>Add a new service order</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service order name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description (optional)"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!projectId && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="isApproved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Approved</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this service order as pre-approved
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Create Service Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
