import { MenuItem } from "./MenuBar";
import { Dialog, Transition } from '@headlessui/react'
import { X } from "phosphor-react";
import { Fragment, useState } from 'react'

export function MenuImage({ icon, title, setAction, isSettedActive = null, options}: MenuItem) {
  const [isOpen, setIsOpen] = useState(false)
  const [uri, setUri] = useState('')

  function selectedImage() {
    // const file = e.target.files?.length ? e.target.files[0] : null
    // if (file) {
    setAction && setAction(uri)
    closeModal()
    setUri('')
    // }
  }
  
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
    {/* <input 
      className="hidden w-full mb-5 text-xs text-gray-1 border border-gray-12 rounded-lg cursor-pointer bg-gray-14 dark:text-gray-10 focus:outline-none dark:bg-gray-2 dark:border-gray-5 dark:placeholder-gray-8" 
      type="file" 
      id="image"
      accept="image/*"
      onChange={selectedImage}
    /> */}
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-14 dark:bg-gray-2 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    className="flex flex-row justify-between mb-2 text-lg font-normal text-gray-1 dark:text-gray-15"
                  >
                    Add Image
                    <X className="w-5 h-5 text-red-600 cursor-pointer" onClick={closeModal}/>
                  </Dialog.Title>
                  <div className="mt-2">
                   <input 
                     className="
                     w-full px-3 py-2 text-sm font-light
                     placeholder-gray-9 
                     border border-gray-12 
                     rounded-md focus:outline-none 
                     focus:ring-nexus-10 focus:border-nexus-10
                     dark:bg-gray-3 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                    dark:focus:ring-nexus-11 dark:focus:border-nexus-11" 
                    placeholder="URI"
                    value={uri}
                    onChange={(e) => setUri(e.target.value)}
                   />
                  </div>

                  <div className="mt-4 flex flex-row justify-end">
                    <button
                      type="button"
                      className="
                          w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
                          border-nexus-9 text-nexus-9 hover:bg-nexus-9 hover:text-gray-12
                          dark:font-light dark:border-nexus-11 dark:text-nexus-11 dark:hover:bg-nexus-11 dark:hover:text-gray-14
                        "
                      onClick={selectedImage}
                    >
                      Add image
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    <button 
      type="button"
      className="
        bg-transparent border-0 rounded-lg h-7 mr-1 p-1 w-7 cursor-pointer
        text-gray-2 hover:bg-gray-13
        dark:text-gray-14 dark:hover:bg-gray-1 
      "
      onClick={openModal}
      >
        {icon}
      </button>
    {/* <label
      className="
        bg-transparent border-0 rounded-lg h-7 mr-1 p-1 w-7 cursor-pointer
        text-gray-2 hover:bg-gray-13
        dark:text-gray-14 dark:hover:bg-gray-1
      "
      htmlFor="image"
    >
      {icon}
    </label> */}
    </>
  );
}