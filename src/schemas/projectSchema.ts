import * as z from "zod"

export const projectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema> 