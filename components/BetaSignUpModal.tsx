import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { UserPlus } from 'phosphor-react'
import Link from 'next/link'

interface BetaSignUpModalProps {
  onModalClose: (state: boolean) => void
}

export function BetaSignUpModal({onModalClose}: BetaSignUpModalProps) {
  const [open, setOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState("writer");
  const [email, setEmail] = useState('');
  const [requestResult, setRequestResult] = useState('')

  const options = [
    { id: "writer", label: "I'm a Writer" },
    { id: "reader", label: "I'm a Reader" },
    { id: "both", label: "A little bit of both" },
  ];
  useEffect(() => {
    if(!open) onModalClose(open)
  }, [open])

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('')
    setEmail(event.target.value)
    setRequestResult('retry')
  }

  const signUpUser = async (event: FormEvent) => {
    event.preventDefault();

    // this is where your mailchimp request is made
    
    await fetch('/api/signupusers', {
      body: JSON.stringify({
        email: email,
        userType: selectedOption
      }),

      headers: {
        'Content-Type': 'application/json',
      },

      method: 'POST',
    }).then(res => {
      if (res.status != 201) setRequestResult('error')
      else {
        setRequestResult('success')
        setTimeout(() => {
          setOpen(false)
        }, 3000)
      } 
    })
    .catch(err => {
      setRequestResult('error')
    });
  };

  const cancelButtonRef = useRef(null)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlus className="h-6 w-6 text-charleston-green" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <Dialog.Title as="h3" className="text-base font-rubik font-semibold leading-6 text-charleston-green">
                        Beta SIGN-UP
                      </Dialog.Title>
                      <Dialog.Description className="font-montserrat font-light text-sm">
                        Sign up for Nexus progress updates and be the first to know when the release is available. Receive notifications straight to your inbox to stay up-to-date on our latest developments!
                      </Dialog.Description>
                      <div className="mt-2">
                        <form id="signup" className="space-y-6" onSubmit={signUpUser}>
                          <input type="hidden" name="remember" defaultValue="true" />
                          <div className="flex flex-col gap-y-3">
                            <div>
                              <label htmlFor="email-address" className="sr-only">
                                Email address
                              </label>
                              <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                autoCapitalize="off"
                                autoCorrect="off"
                                value={email}
                                onChange={handleEmailChange} 
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Email address"
                              />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <RadioGroup value={selectedOption} onChange={setSelectedOption}>
                                <RadioGroup.Label className="sr-only">Select an option</RadioGroup.Label>
                                <div className="space-y-2">
                                  {options.map((option) => (
                                    <RadioGroup.Option key={option.id} value={option.id}>
                                      {({ checked }) => (
                                        <div className="flex items-center space-x-4 cursor-pointer">
                                        <input
                                          id="writerCheckbox"
                                          type="radio"
                                          checked={checked}
                                          onChange={() => setSelectedOption(option.id)}
                                          className={`w-4 h-4 transition-colors duration-200 border-gray-400 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${checked ? "bg-indigo-600 border-indigo-600" : ""}`}
                                        />
                                        <label className="ml-2 block font-roboto font-light text-charleston-green">
                                          {option.label}
                                        </label>
                                        </div>
                                      )}
                                    </RadioGroup.Option>
                                  ))}
                                </div>                              
                              </RadioGroup>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse items-center sm:px-6">
                  <button
                    type="submit"
                    form="signup"
                    className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
                    // onClick={() => setOpen(false)}
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  {requestResult === 'success' ? <p className="flex flex-1 text-center font-roboto font-light text-green-700">Tank you for sign in for the Beta!</p> : <></>}
                  {requestResult === 'error' ? 
                    <div className="flex flex-1 text-center">
                      <span className="font-roboto text-sm font-light text-red-700">
                        Something went wrong, please contact{' '}
                        <Link
                          href="mailto:nexus@nexuslit.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-united-nations-blue font-normal"
                        >
                          nexus@nexuslit.com
                        </Link>{' '}
                        to be added to the Beta
                      </span>
                    </div> 
                    : 
                    <></>
                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}