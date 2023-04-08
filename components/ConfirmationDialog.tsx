import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { Fragment, useEffect, useState } from "react";

interface ConfirmationDialogProps {
  title: string | React.ReactNode
  body: string | React.ReactNode | React.ReactNode[] 
  isModalOpen: boolean,
  onConfirm?: () => void
  onClose?: () => void
}

export function ConfirmationDialog({ title, body, isModalOpen, onConfirm, onClose }: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(isModalOpen)
  }, [isModalOpen])

  function closeModal() {
    setIsOpen(false)
    onClose && onClose()
  }

  // function openModal() {
  //   setIsOpen(true)
  // }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
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
                    {title}
                    <X className="w-5 h-5 text-red-600 cursor-pointer" onClick={closeModal}/>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm font-normal dark:font-light text-gray-1 dark:text-gray-14">
                      {body}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-row flex-1 justify-end gap-x-3">
                  <button
                      type="button"
                      className="
                      w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
                      border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-gray-12
                      dark:font-light dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-gray-14  
                      "
                      
                      onClick={onConfirm}
                    >
                      Confirm
                    </button>
                    
                    <button
                      type="button"
                      className="
                      w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
                      border-red-600 text-red-600 enabled:hover:bg-red-600 enabled:hover:text-gray-14
                      dark:font-light dark:border-red-600 dark:text-red-500 enabled:dark:hover:bg-red-600 enabled:dark:hover:text-gray-14
                      "
                      onClick={closeModal}
                    >
                      Cancel action
                    </button>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}