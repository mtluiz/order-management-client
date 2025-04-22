import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { projectApi, serviceOrderApi } from "../lib/api"
import { ArrowLeft, Save, Plus, Edit, Trash2 } from "lucide-react"
import { Project } from "../types/project"
import { ServiceOrder } from "../types/serviceOrder"
import { DeleteServiceOrderModal } from "../components/ServiceOrder/delete-service-order-modal"
import { CreateServiceOrderModal } from "../components/ServiceOrder/create-service-order-modal"
import { ServiceOrderFormValues } from "../schemas/serviceOrderSchema"

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)

  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])

  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)

  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false)
  const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [selectedOrderName, setSelectedOrderName] = useState<string | null>(null)

  const fetchProjectData = useCallback(async (projectId: string) => {
    try {
      setLoading(true)
      const project = await projectApi.getById(projectId)
      const serviceOrders = await serviceOrderApi.getByProject(projectId)
      setProject(project.data)
      setServiceOrders(serviceOrders.data)
    } catch (error) {
      console.error(error)
      toast("Failed to fetch project data. Please try again.")
      navigate("/projects")
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (id) {
      fetchProjectData(id)
    }
  }, [fetchProjectData, id])

  const handleSaveProject = async () => {
    try {
      setLoading(true)
      if (!id || !project?.name) return
      const p = await projectApi.update(id, project)
      if (p.data) {
        setProject(p.data)
      }
      setIsEditing(false)
      toast("Project updated successfully.")
    } catch (error) {
      console.error(error)
      toast("Failed to update project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteServiceOrder = async () => {
    try {
      if (!orderToDelete) return
      await serviceOrderApi.delete(orderToDelete)
      if (id) {
        const response = await serviceOrderApi.getByProject(id)
        setServiceOrders(response.data)
      }
      toast("Service order deleted successfully.")
    } catch (error) {
      console.error(error)
      toast("Failed to delete service order.")
    } finally {
      setOrderToDelete(null)
      setSelectedOrderName(null)
    }
  }

  const handleCreateServiceOrder = async (data: ServiceOrderFormValues) => {
    try {
      const response = await serviceOrderApi.create({
        ...data,
        isApproved: data.isApproved || false
      })
      setServiceOrders([...serviceOrders, response.data])
    } catch (error) {
      console.error(error)
      toast("Failed to create service order.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <Button className="mt-4" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button disabled={loading} onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="service-orders">Service Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>View and edit project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={project.name || ""}
                    onChange={(e) => setProject({ ...project, name: e.target.value })}
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-gray-50">{project.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={project.description || ""}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
                    {project.description || "No description provided."}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full text-sm text-gray-500">
                <div>Created: {new Date(project.createdDate).toLocaleString()}</div>
                <div>Updated: {new Date(project.updatedDate).toLocaleString()}</div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="service-orders" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Service Orders</h2>
            <Button onClick={() => setIsCreateOrderDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Service Order
            </Button>
          </div>

          {serviceOrders.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">No service orders found</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new service order.</p>
              <Button className="mt-4" onClick={() => setIsCreateOrderDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Service Order
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div
                          className="hover:underline cursor-pointer"
                          onClick={() => navigate(`/service-orders/${order.id}`)}
                        >
                          {order.name}
                        </div>
                      </TableCell>
                      <TableCell>{order.category}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.isApproved ? "Approved" : "Pending"}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/service-orders/${order.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setOrderToDelete(order.id)
                              setSelectedOrderName(order.name)
                              setIsDeleteOrderDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateServiceOrderModal
        isOpen={isCreateOrderDialogOpen}
        onClose={() => setIsCreateOrderDialogOpen(false)}
        onSubmit={handleCreateServiceOrder}
        projectId={id || ""}
      />

      <DeleteServiceOrderModal
        isOpen={isDeleteOrderDialogOpen}
        onClose={() => setIsDeleteOrderDialogOpen(false)}
        onDelete={handleDeleteServiceOrder}
        orderName={selectedOrderName || undefined}
      />
    </div>
  )
}

export default ProjectDetails
