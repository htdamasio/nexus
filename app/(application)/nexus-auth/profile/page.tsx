"use client"
import { DatePicker } from "@/components/customDatePicker";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Gender } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfile, EditProfileSchema } from "@/validations/profile";
import { Divide } from "phosphor-react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import axios from "axios";

const genders = [
  { id: Gender.NONE, name: 'None' },
  { id: Gender.FEMALE, name: 'Female' },
  { id: Gender.MALE, name: 'Male' },
  { id: Gender.OTHER, name: 'Other' },
]

export default function Profile() {
  const {data: session, update: sessionUpdate} = useSession()
  // const [selectedGender, setSelectedGender] = useState()

  const [avatarUrl, setAvatarUrl] = useState('/nexus-book-placeholder.png')
  const [avatarError, setAvatarError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePass, setChangePass] = useState(false)
  const [initialValues, setInitialValues] = useState(false)
  const { register, setValue, control, watch, handleSubmit, clearErrors, formState: { errors } } = useForm<EditProfile>({resolver: zodResolver(EditProfileSchema)})
  const gender = watch('gender')
  const birthday = watch('birthday')

  useEffect(() => {
    if(gender && gender !== session?.user?.gender) {
      console.log('update gender')
      axios('/api/user/profile', {
        method: "PATCH",
        headers: {
          'Content-Type':'application/json'
        },
        data: JSON.stringify({
          gender,
        })
      })
      .then(res => {
        sessionUpdate({
          gender,
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
  },[gender])

  if(session?.user) {
    if(!initialValues) {
      console.log(session.user)
      setValue('gender', session.user.gender)
      setValue('birthday', session.user.birthday)
      setAvatarUrl(session.user.image ?? '/nexus-book-placeholder.png')
      setInitialValues(true)
    }
  }

  function handleChangePassword(data: EditProfile) {
    fetch('/api/user/profile', {
      method: "PATCH",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword
      })
    })
    .then(res => {
      setChangePass(false)
    })
    .catch(err => {
    })
  }

  async function handleAvatarChange(file: File | null) {
    setAvatarError('')
    if(file) {
      if(file.size < 250000) {
        setAvatarUrl(URL.createObjectURL(file))
        const { url, filename } = await fetch('/api/user/profile').then(res => res.json())
        console.log(url, filename)
        await axios(url, {
          method: "PUT",
          headers: {
            'Contente-Type': "multipart/form-data"
          },
          data: file,
          onUploadProgress: (event) => {
            // update some progress bar
            console.log('uploading: ', event.progress)
          }
        })
        .then(res => {
          setAvatarUrl(url.split('?')[0])
          sessionUpdate({
            image: url.split('?')[0]
          })
        })
      } else {
        setAvatarError('Image too large')
      }
    }
  }

  function handleBirthdayChange(birthday: string){
    fetch('/api/user/profile', {
      method: "PATCH",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        birthday  
      })
    })
    .then(res => {
      sessionUpdate({
        birthday
      })
    })
    .catch(err => {
    })
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-1 items-center justify-center font-roboto w-11/12 mx-auto mt-10 max-w-7xl">
      <div className={`
        min-h-[24rem] bg-white h-fit w-full self-center 
        dark:bg-gray-2 dark:shadow-black shadow rounded-lg p-4 sm:p-6 xl:p-8 
        relative ${changePass && 'bottom-16 md:bottom-0'} md:grid grid-cols-1 md:grid-cols-3 gap-y-2 
      `}
      >
        <div className="col-span-1 flex flex-col gap-y-5 items-center justify-center">
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center overflow-hidden">
              <Image alt={session?.user?.name ?? ''} src={avatarUrl} fill/>
            </div>
          <div>
          <input type="file" accept="image/*" id="changeAvatar" className="hidden" onChange={(e) => handleAvatarChange(e.target.files?.length ? e.target.files[0] : null)}/>
          <label 
            htmlFor="changeAvatar" 
            className="
              py-2 px-3 rounded-md text-sm cursor-pointer
              ring-0 border 
              border-nexus-9 text-nexus-9 hover:bg-nexus-9 hover:text-gray-15
              dark:border-nexus-11 dark:text-nexus-11 dark:hover:bg-nexus-11 dark:hover:text-gray-14
            "
          >
              Change avatar
          </label>
          </div>
          {avatarError.length > 0 && 
            <p className="font-light text-red-400 text-sm">{avatarError}</p>
          }
          {/* <div>Button to update</div> */}
        </div>
        
        <div className="col-span-2 flex flex-col p-3 gap-y-2 justify-between">
          <div className="flex flex-col gap-y-2">
          
            {/* disabled: username, email */}
            <div className="flex w-full flex-col md:flex-row gap-y-2 gap-x-3">
              
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                  <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                    Username:
                  </span>
                </div>
                <input 
                  className="
                  w-full px-3 py-2 pl-20 text-sm font-light
                  placeholder-gray-9 
                  border-0 border-gray-12 
                  rounded-md focus:outline-none 
                  focus:ring-nexus-10 focus:border-nexus-10
                  dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                  " 
                  type="text" 
                  value={session?.user?.name ?? ''} 
                  disabled
                />
              </div>
              
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                  <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                    Email:
                  </span>
                </div>
                <input 
                  className="
                  w-full px-3 py-2 pl-14 text-sm font-light
                  placeholder-gray-9 
                  border-0 border-gray-12 
                  rounded-md focus:outline-none 
                  focus:ring-nexus-10 focus:border-nexus-10
                  dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                  dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                  "  
                  type="text" 
                  value={session?.user?.email ?? ''} 
                  disabled
                />
              </div>
            
            </div>

            {/* Birthday, gender */}
            <div className="flex w-full flex-col md:flex-row gap-y-2 gap-x-3">
              <div className="w-full">
              {session?.user &&
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                  <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                    Birthday:
                  </span>
                </div> 
                  <Controller
                  name="birthday"
                  control={control}
                  defaultValue={birthday}
                  render={({ field }) => (         
                    <div className="w-full pl-[4.5rem]">
                      <DatePicker onChange={(async date => {
                        field.onChange(date.toISOString())
                        handleBirthdayChange(date.toISOString())
                      })} defauldDate={birthday}/>
                    </div>       
                  )}
                  />
                </div>
              }
              </div>
              <div className="w-full">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                    <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                      Gender:
                    </span>
                  </div>
                  
                  <div className="w-full pl-16">
                    <select 
                      className="
                      w-full px-3 py-2 text-sm font-light
                      placeholder-gray-9 
                      border border-gray-12 
                      rounded-md focus:outline-none 
                      focus:ring-nexus-10 focus:border-nexus-10
                      dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                    dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                      " 
                      {...register("gender")}
                    >
                      <option value="NONE" className="text-sm font-light dark:text-gray-15">Select your gender</option>
                      <option value="MALE" className="text-sm font-light dark:text-gray-15">Male</option>
                      <option value="FEMALE" className="text-sm font-light dark:text-gray-15">Female</option>
                      <option value="OTHER" className="text-sm font-light dark:text-gray-15">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          {/* Change password */}
          <div className="flex flex-col gap-y-2">

            <div className={`
              flex flex-col w-full gap-y-3 p-3 bg-gray-13 dark:bg-gray-5 rounded-md transition ease-in-out delay-0
              ${changePass ? '-translate-y-0' : 'translate-y-16 -z-10'}
            `}
            >
              {changePass && 
                <>
                  <form onSubmit={handleSubmit(handleChangePassword)} className="flex flex-col gap-y-3">
                    {/* New Password */}
                    <div>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                          <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                            New Password:
                          </span>
                        </div>
                        <input 
                          className="
                          w-full px-3 py-2 pl-28 pr-10 text-sm font-light
                          placeholder-gray-9 
                          border-0 border-gray-12 
                          rounded-md focus:outline-none 
                          focus:ring-nexus-10 focus:border-nexus-10
                          dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                        dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                          " 
                          type={showPassword ? 'text':'password'} 
                          {...register("password")}
                        />
                        <div 
                          className="absolute inset-y-0 right-2 pl-2.5 flex items-center text-secondary-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          { showPassword ? 
                            <Eye className="w-6 h-6 cursor-pointer text-gray-1 dark:text-gray-14"/>
                            :
                            <EyeSlash className="w-6 h-6 cursor-pointer text-gray-1 dark:text-gray-14"/>
                          }
                        </div>
                      </div>
                      <p className="font-light text-red-400 text-sm mt-1">{errors.password?.message}</p>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
                          <span className="flex items-center self-center text-sm font-normal dark:text-gray-15">
                            Confirm Password:
                          </span>
                        </div>
                        <input 
                          className="
                          w-full px-3 py-2 pl-[8.25rem] pr-10 text-sm font-light
                          placeholder-gray-9 
                          border-0 border-gray-12 
                          rounded-md focus:outline-none 
                          focus:ring-nexus-10 focus:border-nexus-10
                          dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                        dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                          " 
                          type={showConfirmPassword ? 'text':'password'} 
                          {...register("confirmPassword")}
                        />
                        <div 
                          className="absolute inset-y-0 right-2 pl-2.5 flex items-center text-secondary-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          { showConfirmPassword ? 
                            <Eye className="w-6 h-6 cursor-pointer text-gray-1 dark:text-gray-14"/>
                            :
                            <EyeSlash className="w-6 h-6 cursor-pointer text-gray-1 dark:text-gray-14"/>
                          }
                        </div>
                      </div>
                      <p className="font-light text-red-400 text-sm mt-1">{errors.confirmPassword?.message}</p>
                    </div>
                      
                    <div className="flex flex-row justify-end">
                      <button 
                        type="submit"
                        className="text-sm font-light py-1 px-2 ring-0 border rounded-md border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-gray-14"
                      >
                        Confirm
                      </button>

                    </div>
                  </form>
                </>
              }
            </div>
            
            <div className="flex flex-row justify-end">
            <button
              onClick={() => {
                if(changePass) {
                  clearErrors()
                }

                setChangePass(!changePass)
                setValue('password', '')
                setValue('confirmPassword', '')
              }}
              type="button"
              className={`w-auto h-auto
              py-2 px-3 rounded-md text-sm cursor-pointer
              ring-0 border 
              ${changePass ? 
                `border-red-500 text-red-500 hover:bg-red-500 hover:text-gray-15` 
                :
                `border-nexus-9 text-nexus-9 hover:bg-nexus-9 hover:text-gray-15
                dark:border-nexus-11 dark:text-nexus-11 dark:hover:bg-nexus-11 dark:hover:text-gray-14`
              }
              `}
            >
              {changePass ? 'Cancel':'Change password'}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}