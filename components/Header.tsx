"use client";

import { useEffect, useState } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import { List, X } from 'phosphor-react'
import { BetaSignUpModal } from './BetaSignUpModal';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [signUp, setSignUp] = useState(false)

  function handleModalCLose(modalState: boolean) {
    setSignUp(false)
  }

  useEffect(() => {
    const onScroll = () => {
        setIsScrolled(window.pageYOffset > 10)
      };
    window.addEventListener("scroll", onScroll);
  });

  return (
    <header className={` ${isScrolled ? 'bg-white':'bg-transparent'} drop-shadow-lg rounded-b-xl fixed flex z-10 w-full`}>
      <nav className="w-full mx-auto text-charleston-green flex max-w-7xl items-center justify-between p-5 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="h-8 w-auto font-montserrat text-4xl">Nexus</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <List className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden font-montserrat font-normal lg:flex lg:gap-x-12">
                  
            <a href="#read" className="text-sm leading-6 text-charleston-green">
              Read
            </a>      
            <a href="#functionalities" className="text-sm leading-6 text-charleston-green">
              Write
            </a>
            <a href="#community" className="text-sm leading-6 text-charleston-green">
              Community
            </a>
          </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a className="text-sm font-montserrat font-bold py-2 px-6 rounded-lg text-united-nations-blue leading-6 border-solid border-2 cursor-pointer border-united-nations-blue hover:border-[#93C2FF] hover:text-[#93C2FF]" onClick={() => setSignUp(true)}>
            BETA SIGN-UP
          </a>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="h-8 w-auto font-montserrat font-medium">Nexus</span>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 font-montserrat">
                <a
                  href="#read"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base leading-7 text-charleston-green hover:bg-gray-50"
                >
                  Read
                </a>
                <a
                  href="#functionalities"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base leading-7 text-charleston-green hover:bg-gray-50"
                >
                  Write
                </a>
                <a
                  href="#community"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base leading-7 text-charleston-green hover:bg-gray-50"
                >
                  Community
                </a>
              </div>
              <div className="py-6">
                <a
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base leading-7 font-montserrat font-normal text-united-nations-blue hover:bg-gray-50"
                  onClick={() => setSignUp(true)}
                >
                  BETA SIGN-UP
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      {signUp ? <BetaSignUpModal onModalClose={handleModalCLose}/> : <></>}
    </header>
  )
}
