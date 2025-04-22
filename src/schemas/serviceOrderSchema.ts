import * as z from "zod"

export const serviceOrderSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().nullable(),
  projectId: z.string().min(1, { message: "Project ID is required" }),
  isApproved: z.boolean().default(false).optional()
})

export type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema> 