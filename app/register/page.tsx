"use client"
import { GoogleLogo, FacebookLogo } from "phosphor-react";
import { RegisterForm, registerSchema } from "@/forms/registerForm";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/customDatePicker";
import { Alert } from "flowbite-react";
import axios from "axios";
import { signIn } from "next-auth/react"
import { LoginForm } from "@/forms/loginForm";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter()
  const {register, handleSubmit, control, setError, formState: { errors }} = useForm<RegisterForm>({resolver: zodResolver(registerSchema)})
  
  async function handleRegisterSubmit(data: RegisterForm) {
    await axios.post('/api/register', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      performLogin({email: data.email, password: data.password})
    })
    .catch(err => {
      if (err.response.status === 409) {
        if (err.response.data.error.includes('username')) {
          setError("username", {message: "Sory, someone was faster, choose another username"})
        }
        console.log(err.response.data.error.includes('email'))
        if (err.response.data.error.includes('email')) {
          setError("email", {message: "Email address already in use"})
        }
      } else {
        setError("root.unexpected", {message: "An unexpected error occurred, please try again later."})
      }
    })
  }
  
  async function performLogin(data: LoginForm) {
    await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })
    .then(res => {
      router.push('/')
    })
    .catch(err => {
      setError("root.unexpected", {message: "An unexpected error occurred, please try again later."})
  })
  }

  return (
    <>
    {
      errors.root?.unexpected?.message ? 
      <Alert
      className="justify-center items-center text-center"
      color="failure"
      rounded={false}
    >
      <span className="font-medium">
        {errors.root?.unexpected?.message}
      </span>
    </Alert>
      :
      ''
    }
      <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto">
              <div className="max-w-md mx-auto my-10">
                  <div className="text-center">
                      <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Register</h1>
                      <p className="text-gray-500 dark:text-gray-400">Create your account to discover new worlds</p>
                  </div>
                  <div className="m-7">
                      <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                          <div className="mb-4">
                              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Username</label>
                              <input 
                                type="text"
                                placeholder="theBestOne" 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("username")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.username?.message}</p>
                          </div>                       
                          <div className="mb-4">
                              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                              <input 
                                type="email"
                                placeholder="myemail@gmail.com" 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("email")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.email?.message}</p>
                          </div>
                          <div className="mb-4 flex gap-3">
                            <div className="flex-1">
                              <label htmlFor="password" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Password</label>
                              <input 
                                type="password"
                                placeholder="Your Password" 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("password")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.password?.message}</p>
                            </div>
                            <div className="flex-1">
                              <label htmlFor="password" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Confirm password</label>
                              <input 
                                type="password"
                                placeholder="Your Password Again" 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("confirmPassword")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.confirmPassword?.message}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Gender</label>
                              <select 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("gender")}
                              >
                                <option value="NONE">Select your gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                              </select>
                          </div>            
                          <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Date of birth</label>
                              <Controller
                              name="birthday"
                              control={control}
                              defaultValue={new Date().toISOString()}
                              render={({ field }) => (
                                <DatePicker onChange={(date) => field.onChange(date.toISOString())}/>
                              )}
                            />
                            <p className="font-light text-red-400 text-sm mt-1">{errors.birthday?.message}</p>
                          </div>
                          <div className="mb-4">
                              <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:bg-indigo-600 focus:outline-none">Sign Up</button>
                          </div>
                          <p className="text-sm text-center text-gray-400">Already have an account? <a href="/login" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign in</a>.</p>
                      </form>

                      <div className="flex items-center my-4 space-x-4">
                          <hr className="w-full border border-gray-300" />
                          <div className="font-semibold text-gray-400">OR</div>
                          <hr className="w-full border border-gray-300" />
                      </div>

                      <footer>
                        <div className="grid grid-cols-1 gap-4">
                            {/* <a href="#"
                                className="flex flex-row flex-1 items-center justify-center gap-2 rounded-md text-center bg-indigo-500 py-2.5 px-4 text-white hover:bg-indigo-600 active:translate-y-[0.125rem]">
                                  <FacebookLogo weight="bold" className="w-5 h-5"/>
                                  Facebook
                            </a> */}
                            <button
                                onClick={() => signIn("google", {callbackUrl: '/' })}
                                className="flex flex-row flex-1 items-center justify-center gap-2 rounded-md bg-indigo-500 py-2.5 px-4 text-white hover:bg-indigo-600 active:translate-y-[0.125rem]">
                              <GoogleLogo weight="bold" className="w-5 h-5"/>
                                  Google
                            </button>
                        </div>

                        <div className="mt-8 text-sm text-gray-400">
                            By signing in to Nexus, you agree to our {' '}
                            <a href="#" className="font-medium text-gray-500">Terms</a> and {' '}
                            <a href="#" className="font-medium text-gray-500">Privacy Policy</a>.
                        </div>
                    </footer>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}