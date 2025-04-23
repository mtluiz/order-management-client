import axios from "axios"
import { Project, ProjectRequest, ServiceOrder, ServiceOrderRequest } from "../types"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const projectApi = {
  getAll: () => api.get<{ data: Project[], total: number }>("/projects"),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: ProjectRequest) => api.post<Project>("/projects", data),
  update: (id: string, data: ProjectRequest) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

export const serviceOrderApi = {
  getAll: () => api.get<{ data: ServiceOrder[], total: number }>("/service-orders"),
  getById: (id: string) => api.get<ServiceOrder>(`/service-orders/${id}`),
  getByProject: (projectId: string) => api.get<{ data: ServiceOrder[], total: number }>(`/service-orders?projectId=${projectId}`),
  create: (data: ServiceOrderRequest) => api.post<ServiceOrder>("/service-orders", data),
  update: (id: string, data: ServiceOrderRequest) => api.put<ServiceOrder>(`/service-orders/${id}`, data),
  delete: (id: string) => api.delete(`/service-orders/${id}`),
}
