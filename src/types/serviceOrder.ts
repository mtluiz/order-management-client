import { Project } from "./project"

export interface ServiceOrder {
  id: string
  name: string
  category: string
  description: string | null
  projectId: string
  createdDate: Date
  updatedDate: Date
  isApproved: boolean
  project: Project
}

export interface ServiceOrderRequest {
  name: string
  category: string
  description: string | null
  projectId: string
  isApproved: boolean
} 