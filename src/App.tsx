import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import ServiceOrders from "./pages/ServiceOrders"
import ServiceOrderDetails from "./pages/ServiceOrderDetails"
import { Layout } from "./components/Layout/layout"
import { UpdatePrompt } from "./components/UpdatePrompt"
import { useEffect, useState } from "react"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, checkAuth } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await checkAuth()
        setIsAuthenticated(!!userData)
      } catch (error) {
        console.log(error)
        setIsAuthenticated(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isVerifying || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <ServiceOrders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-orders/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ServiceOrderDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" expand={true} richColors />
        <UpdatePrompt />
      </Router>
    </AuthProvider>
  )
}

export default App
