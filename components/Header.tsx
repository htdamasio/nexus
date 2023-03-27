"use client";

import { useEffect, useState } from 'react'
import { User, Books, Gear, SignOut, BookOpen, UserCircle, SignIn, MagnifyingGlass } from 'phosphor-react'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';
import { Autocomplete } from './Autocomplete';
import Link from 'next/link';
import { Dropdown, Tooltip } from 'flowbite-react';

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
              <span className="h-8 w-auto font-montserrat font-extrabold text-4xl text-[#8530d1]">Nexus</span>
            </a>
            <a href="/nexus-auth/write/new-book" className="text-sm leading-6 text-charleston-green hover:text-base">
              <Tooltip animation="duration-300" content="Write your story">
                <BookOpen className="w-7 h-7 hover:text-purple-800"/>
              </Tooltip>
            </a>
          </div>
        <div className="flex flex-1 gap-2 lg:gap-0 lg:justify-end items-center">
          <div className="lg:hidden font-montserrat font-extrabold text-4xl text-[#8530d1]">N</div>
          <div className="hidden lg:block lg:flex-1 lg:mx-3">
            <Autocomplete  options={books}/>
          </div>
          {
            session?.user ?
            <div className="flex flex-1 lg:flex-none items-center gap-3 justify-end"> 
              <p className="hidden lg:flex">Hi, {session.user.name}</p>
              <MagnifyingGlass 
                className="w-7 h-7 cursor-pointer lg:hidden text-[#121212] dark:text-[#fafafa]"
              />
              <Dropdown
                className="w-60"
                arrowIcon={false}
                inline={true}
                label={
                  session.user.image ?
                  <Image
                    className="rounded-[9999px] focus:ring-purple-300 border-none" 
                    alt="User image" 
                    src={session.user.image} 
                    width={30} 
                    height={30}
                  />
                  :
                  <UserCircle weight='light' className="w-8 h-8 text-[#121212] dark:text-[#fafafa]"/>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    {session.user.name}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {session.user.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item className="hover:text-purple-800 dark:hover:text-purple-200">
                  <div className="flex flex-row items-center gap-1">
                  <User className="w-4 h-4"/>
                  My Profile
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="hover:text-purple-800 dark:hover:text-purple-200">
                <div className="flex flex-row items-center gap-1">
                  <Books className="w-4 h-4"/>
                  Library
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="hover:text-purple-800 dark:hover:text-purple-200">
                <Link href='/nexus-auth/author-dashboard' className="flex flex-row items-center gap-1">
                  <BookOpen className="w-4 h-4"/>
                  Author Dashboard
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="hover:text-purple-800 dark:hover:text-purple-200">
                <div className="flex flex-row items-center gap-1">
                  <Gear className="w-4 h-4"/>
                  Settings
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {signOut()}} className="hover:text-purple-800 dark:hover:text-purple-200">
                <div className="flex flex-row items-center gap-1">
                  <SignOut className="w-4 h-4"/>
                  Sign out
                  </div>
                </Dropdown.Item>
            </Dropdown>
            </div>
            : 
            <div className="flex flex-1 lg:flex-none justify-end" >
              {/* <Tooltip content="Login"> */}
              <a
              href="/login"
              // className="flex flex-row items-center gap-2 py-1 px-2 rounded-md border-2 border-[#310055] text-[#310055] hover:text-[#3C0663] dark:border-[#DC97FF] dark:text-[#DC97FF] dark:hover:text-[#D283FF]"
              className="flex flex-row items-center gap-2 py-1 px-2 rounded-md border-2 text-indigo-500 border-indigo-500 hover:border-indigo-600 focus:border-indigo-600"
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
