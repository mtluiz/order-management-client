export interface Project {
  id: string
  name: string
  description: string | null
  createdDate: string | Date
  updatedDate: string | Date
  isApproved: boolean
}

export interface ProjectRequest {
  name: string
  description?: string | null
} 