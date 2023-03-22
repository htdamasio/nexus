"use client"
import { GoogleLogo } from "phosphor-react";
import { LoginForm, loginSchema } from "@/forms/loginForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "flowbite-react";

export default function Register({searchParams}: {searchParams?: { callbackUrl: string }}) {
  const router = useRouter()
  const {register, handleSubmit, setError, formState: { errors }} = useForm<LoginForm>({resolver: zodResolver(loginSchema)})

  async function handleLoginSubmit(data: LoginForm) {
    const login = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })
    .then(res => {
      if(res?.status !== 200) {
        setError("root.invalid", {message: "Invalid email or password"})
      } else {
        router.push(searchParams?.callbackUrl ?? '/')
      }
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
      >
        <span className="font-medium">
          {errors.root?.unexpected?.message}
        </span>
      </Alert>
        :
        ''
      }
      <div className="flex items-center min-h-screen bg-[#fafafa] dark:bg-gray-900">
          <div className="container mx-auto">
              <div className="max-w-md mx-auto my-10">
                  <div className="text-center">
                      <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign in</h1>
                      <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
                  </div>
                  <div className="m-7">
                      <form onSubmit={handleSubmit(handleLoginSubmit)}>
                          <div className="mb-4">
                              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                              <input 
                                type="text"  
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                placeholder="youremail@gmail.com"
                                {...register("email")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.email?.message}</p>
                          </div>
                          <div className="mb-4">
                              <div className="flex justify-between mb-2">
                                  <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                                  <a href="#!" className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300">Forgot password?</a>
                              </div>
                              <input 
                                type="password"
                                placeholder="Your Password" 
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                                {...register("password")}
                              />
                              <p className="font-light text-red-400 text-sm mt-1">{errors.password?.message}</p>
                          </div>
                          <div className="mb-6">
                              <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:bg-indigo-600 focus:outline-none">Sign in</button>
                              <p className="font-light text-red-400 text-sm mt-1">{errors.root?.invalid?.message}</p>
                          </div>
                          <p className="text-sm text-center text-gray-400">Don&#x27;t have an account yet? <Link href="/register" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign up</Link>.</p>
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
                                onClick={() => signIn("google",  {callbackUrl: searchParams?.callbackUrl ?? '/' })}
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