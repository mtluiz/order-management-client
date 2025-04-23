import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { serviceOrderApi } from "../lib/api"
import { ArrowLeft, Save, Edit } from "lucide-react"
import { ServiceOrder } from "../types"

const ServiceOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedServiceOrder, setEditedServiceOrder] = useState<Partial<ServiceOrder>>({})

  const fetchServiceOrderData = useCallback(async (orderId: string) => {
    try {
      setLoading(true)
      const response = await serviceOrderApi.getById(orderId)
      const serviceOrderData = response.data
      setServiceOrder(serviceOrderData)
      setEditedServiceOrder(serviceOrderData)
    } catch (error) {
      console.error(error)
      toast("Failed to fetch service order data. Please try again.")
      navigate("/service-orders")
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const handleSaveServiceOrder = async () => {
    try {
      if (!id || !serviceOrder?.name || !serviceOrder?.category) {
        toast("Name and category are required.")
        return
      }

      const response = await serviceOrderApi.update(id, {
        name: editedServiceOrder.name || "",
        category: editedServiceOrder.category || "",
        description: editedServiceOrder.description || "",
        projectId: editedServiceOrder.projectId || "",
        isApproved: editedServiceOrder.isApproved || false
      })
      setServiceOrder(response.data)
      setIsEditing(false)
      toast("Service order updated successfully.")
    } catch (error) {
      console.error(error)
      toast("Failed to update service order. Please try again.")
    }
  }

  useEffect(() => {
    if (id) {
      fetchServiceOrderData(id)
    }
  }, [fetchServiceOrderData, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service order data...</p>
        </div>
      </div>
    )
  }

  if (!serviceOrder) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Service order not found</h3>
        <Button className="mt-4" onClick={() => navigate("/service-orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Service Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/service-orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Service Orders
        </Button>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveServiceOrder}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Service Order
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Order Information</CardTitle>
          <CardDescription>View and edit service order details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedServiceOrder.name || ""}
                onChange={(e) => setEditedServiceOrder({ ...editedServiceOrder, name: e.target.value })}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">{serviceOrder.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {isEditing ? (
              <Input
                id="category"
                value={serviceOrder.category || ""}
                onChange={(e) => setServiceOrder({ ...serviceOrder, category: e.target.value })}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">{serviceOrder.category}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={serviceOrder.description || ""}
                onChange={(e) => setServiceOrder({ ...serviceOrder, description: e.target.value })}
                rows={4}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
                {serviceOrder.description || "No description provided."}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <div className="p-2 border rounded-md bg-gray-50">{serviceOrder.project ? serviceOrder.project.name : "Unknown Project"}</div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="approval"
              checked={serviceOrder.isApproved || false}
              onCheckedChange={(checked) => {
                setEditedServiceOrder({ ...editedServiceOrder, isApproved: checked })
              }}
              disabled={!isEditing}
            />
            <Label htmlFor="approval" className="cursor-pointer">
              {serviceOrder.isApproved || editedServiceOrder.isApproved ? "Approved" : "Pending Approval"}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-between w-full text-sm text-gray-500">
            <div>Created: {new Date(serviceOrder.createdDate).toLocaleString()}</div>
            <div>Updated: {new Date(serviceOrder.updatedDate).toLocaleString()}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ServiceOrderDetails
