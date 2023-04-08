import { Gender } from "@prisma/client"
import { ZodType, z } from 'zod'

export type EditProfile = {
  gender?: Gender,
  birthday?: string,
  password?: string,
  confirmPassword?: string
}

export const EditProfileSchema: ZodType<EditProfile> = z.object({
  gender: z.custom<Gender>().optional(),
  birthday: z.string().datetime().optional(),
  password: z.string().min(6).max(30).optional(),
  confirmPassword: z.string().min(6).max(30).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})