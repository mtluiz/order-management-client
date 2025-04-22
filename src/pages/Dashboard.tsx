import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { projectApi, serviceOrderApi } from "../lib/api"
import { Briefcase, FileText } from "lucide-react"

interface DashboardStats {
  totalProjects: number
  totalServiceOrders: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalServiceOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, serviceOrdersRes] = await Promise.all([projectApi.getAll(), serviceOrderApi.getAll()])

        const projects = projectsRes.data
        const serviceOrders = serviceOrdersRes.data

        setStats({
          totalProjects: projects.length,
          totalServiceOrders: serviceOrders.length,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your service management dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-gray-500 mt-1">
              <Link to="/projects" className="text-gray-900 hover:underline">
                View all projects
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Service Orders</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServiceOrders}</div>
            <p className="text-xs text-gray-500 mt-1">
              <Link to="/service-orders" className="text-gray-900 hover:underline">
                View all service orders
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
