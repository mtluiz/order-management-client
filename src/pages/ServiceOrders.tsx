import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { serviceOrderApi } from "../lib/api"
import { Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { ServiceOrder } from "../types"
import { DeleteServiceOrderModal } from "@/components/ServiceOrder/delete-service-order-modal"

const ServiceOrders: React.FC = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServiceOrders()
  }, [])

  const fetchServiceOrders = async () => {
    try {
      setLoading(true)
      const response = await serviceOrderApi.getAll()
      setServiceOrders(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch service orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteServiceOrder = async () => {
    try {
      if (orderToDelete) {
        await serviceOrderApi.delete(orderToDelete)
        setIsDeleteDialogOpen(false)
        setOrderToDelete(null)
        toast.success("Service order deleted successfully.")
        fetchServiceOrders()
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete service order. Please try again.")
    }
  }

  const filteredServiceOrders = serviceOrders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Orders</h1>
        <p className="text-gray-500 mt-2">Manage all service orders across projects.</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search service orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service orders...</p>
          </div>
        </div>
      ) : filteredServiceOrders.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">No service orders found</h3>
          <p className="mt-1 text-gray-500">Create service orders from the project details page.</p>
          <Button className="mt-4" onClick={() => navigate("/projects")}>
            Go to Projects
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
              {filteredServiceOrders.map((order) => (
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {order.isApproved ? "Approved" : "Pending"}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={order.isApproved ? "Unapprove" : "Approve"}
                      >
                        {!order.isApproved ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/service-orders/${order.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setOrderToDelete(order.id)
                          setIsDeleteDialogOpen(true)
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

      <DeleteServiceOrderModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteServiceOrder}
        orderName={orderToDelete || undefined}
      />
    </div>
  )
}

export default ServiceOrders
