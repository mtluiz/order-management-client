import axios from "axios"
import { Project, ProjectRequest, ServiceOrder, ServiceOrderRequest } from "../types"

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Project API functions
export const projectApi = {
  getAll: () => api.get<Project[]>("/projects"),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: ProjectRequest) => api.post<Project>("/projects", data),
  update: (id: string, data: ProjectRequest) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

// ServiceOrder API functions
export const serviceOrderApi = {
  getAll: () => api.get<ServiceOrder[]>("/service-orders"),
  getById: (id: string) => api.get<ServiceOrder>(`/service-orders/${id}`),
  getByProject: (projectId: string) => api.get<ServiceOrder[]>(`/service-orders?projectId=${projectId}`),
  create: (data: ServiceOrderRequest) => api.post<ServiceOrder>("/service-orders", data),
  update: (id: string, data: ServiceOrderRequest) => api.put<ServiceOrder>(`/service-orders/${id}`, data),
  delete: (id: string) => api.delete(`/service-orders/${id}`),
}
