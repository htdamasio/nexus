import {z, ZodType} from 'zod'

const GenderEnum = z.enum(["NONE", "MALE", "FEMALE", "OTHER"]);

export type RegisterForm = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: "NONE" | "MALE" | "FEMALE" | "OTHER"
  birthday: string
}

export const registerSchema: ZodType<RegisterForm> = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).max(30),
  confirmPassword: z.string().min(6).max(30),
  gender: z.enum(GenderEnum.options),
  birthday: z.string().datetime()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})