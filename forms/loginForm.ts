import {z, ZodType} from 'zod'

export type LoginForm = {
  email: string,
  password: string,
}

export const loginSchema: ZodType<LoginForm> = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
});