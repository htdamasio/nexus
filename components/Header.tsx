"use client";

import { Fragment, useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';
import { Autocomplete } from './Autocomplete';
import Link from 'next/link';
import { Tooltip } from 'flowbite-react';
import { Menu, Transition } from '@headlessui/react'
import { User, Books, Gear, SignOut, BookOpen, UserCircle, SignIn, MagnifyingGlass, UserGear } from '@phosphor-icons/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const { data: session } = useSession()

  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [signUp, setSignUp] = useState(false)

  // function handleModalCLose(modalState: boolean) {
  //   setSignUp(false)
  // }

  useEffect(() => {
    const onScroll = () => {
        setIsScrolled(window.pageYOffset > 10)
      };
    window.addEventListener("scroll", onScroll);
  });

  const books = ['book 1', 'book 2', 'some other story 3', 'a fantastic story 4', 'with a great plot twist ']

  return (
    <header className={` ${isScrolled ? 'bg-gray-14 dark:bg-gray-2':'bg-transparent'} drop-shadow-lg sticky top-0 flex z-10 w-full`}>
      <nav className="w-11/12 mx-auto text-charleston-green flex max-w-7xl items-center justify-between py-2" aria-label="Global">
          <div className="hidden lg:flex lg:flex-row items-center gap-3">
            <a href="#">
              <span className="h-8 w-auto font-montserrat font-extrabold text-4xl text-nexus-8">Nexus</span>
            </a>
            <a href="/nexus-auth/write/new-book" className="text-sm leading-6 text-charleston-green hover:text-base">
              <Tooltip animation="duration-300" content="Write your story">
                <BookOpen className="w-7 h-7 text-nexus-9 hover:text-nexus-8 dark:text-nexus-11 dark:hover:text-nexus-10"/>
              </Tooltip>
            </a>
          </div>
        <div className="flex flex-1 gap-2 lg:gap-0 lg:justify-end items-center">
          <div className="lg:hidden font-montserrat font-extrabold text-4xl text-nexus-8">N</div>
          <div className="hidden lg:block lg:flex-1 lg:mx-3">
            <Autocomplete  options={books}/>
          </div>
          {
            session?.user ?
            <div className="flex flex-1 lg:flex-none items-center gap-3 justify-end content-center"> 
              <p className="hidden lg:flex text-nexus-7 dark:text-nexus-11">Hi, {session.user.name}</p>
              <MagnifyingGlass 
                className="w-7 h-7 cursor-pointer lg:hidden text-[#121212] dark:text-[#fafafa]"
              />
              <Menu as="div" className="relative inline-block text-left ">
                  <div className='relative w-8 h-8'>
                  <Menu.Button className="inline-flex w-full justify-center">
                  {session.user.image ?
                   <Image
                    className="rounded-[9999px] focus:ring-purple-300 border-none" 
                    alt="User image" 
                    src={session.user.image} 
                    fill
                  />
                   :
                  <UserCircle weight='light' className="w-8 h-8 text-[#121212] dark:text-[#fafafa]"/>
                  }  
                    
                    {/* Options
                    <ArrowDown
                      className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    /> */}
                  </Menu.Button>
                  </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-1 divide-opacity-10 dark:divide-gray-14 dark:divide-opacity-10 rounded-md bg-white dark:bg-gray-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href='/nexus-auth/profile' className="flex flex-row flex-1 items-center">
                            <button
                              className={`${
                                active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <User className="mr-2 w-4 h-4"/>
                              My Profile
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href='/nexus-auth/library' className="flex flex-row flex-1 items-center">
                            <button
                              className={`${
                                active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <Books className="mr-2 w-4 h-4"/>
                              Library
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                      {({ active }) => (
                          <Link href='/nexus-auth/author-dashboard' className="flex flex-row flex-1 items-center">
                            <button
                              className={`${
                                active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              
                              <BookOpen className="mr-2 w-4 h-4"/>
                              Author Dashboard
                          </button>
                        </Link>
                      )}
                      </Menu.Item>
                    </div>
                    {session.user.role === 'ADMIN' &&
                      <div className="px-1 py-1 mx-2">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href='/admin' className="flex flex-row flex-1 items-center">
                              <button
                                className={`${
                                  active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                <UserGear className="mr-2 w-4 h-4"/>
                                Admin
                              </button>
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    }
                    <div className="px-1 py-1 mx-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <Gear className="mr-2 w-4 h-4"/>
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {signOut()}}
                            className={`${
                              active ? 'bg-nexus-9 text-gray-15 dark:bg-nexus-10 dark:text-gray-1' : 'text-gray-2 dark:text-gray-14'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <SignOut className="mr-2 w-4 h-4"/>
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            : 
            <div className="flex flex-1 lg:flex-none justify-end" >
              {/* <Tooltip content="Login"> */}
              <a
              href="/login"
              // className="flex flex-row items-center gap-2 py-1 px-2 rounded-md border-2 border-[#310055] text-[#310055] hover:text-[#3C0663] dark:border-[#DC97FF] dark:text-[#DC97FF] dark:hover:text-[#D283FF]"
              className="flex flex-row items-center gap-2 py-1 px-2 rounded-md border-2 
              text-nexus-9 hover:text-nexus-8 border-nexus-9 hover:border-nexus-8 focus:border-nexus-8
              dark:text-nexus-10 dark:hover:text-nexus-9 dark:border-nexus-10 dark:hover:border-nexus-9 dark:focus:border-nexus-9"
              >
                <SignIn className="w-4 h-4 "/>
                Log in
              </a>
              {/* </Tooltip> */}
            </div>
          }
        </div>
      </nav>
      {/* {signUp ? <BetaSignUpModal onModalClose={handleModalCLose}/> : <></>} */}
    </header>
  )
}
