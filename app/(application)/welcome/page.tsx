"use client"
import Image from "next/image";
import { Book, Pencil, UsersFour, MagnifyingGlass, ListBullets, Plus, ChatCircleText, TrendUp } from "phosphor-react";


const readerFeatures = [
  {
    name: 'Search',
    description:
      'Navigate and find the best story for you',
    icon: MagnifyingGlass,
  },
  {
    name: 'Diversity',
    description:
      'You can find a lot of different book genres and writing styles that best suit you',
    icon: ListBullets,
  },
  {
    name: 'Community',
    description:
      'Be a part of and help to grow an incredible and supportive community',
    icon: UsersFour,
  },
  {
    name: 'Much more',
    description:
      'We are just in the beginning of this journey, and lots of features are coming. You can help us build them',
    icon: Plus,
  },
]

const writerFeatures = [
  {
    name: 'Write',
    description:
      'You can find a lot of tools to assist with your writing. And many more are coming',
    icon: Pencil,
  },
  {
    name: 'Interact',
    description:
      'An active community where you can engage, share your creations, receive feedback, and find support',
    icon: ChatCircleText,
  },
  {
    name: 'Grow',
    description:
      "Don't let your tale gather cobwebs. Publish on Nexus, and discover new fans. Take the first step on the path to awesomeness!",
    icon: TrendUp,
  },
]

export default function Welcome(){
  return (
    <div className="font-roboto w-11/12 mx-auto max-w-7xl">
      {/* Hero Section */}
      <div className="container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
                <h1 className="text-3xl font-bold tracking-wide text-gray-800 dark:text-white lg:text-5xl">
                    Where stories come to life in unexpected ways.
                </h1>
                
                <p className="text-gray-800 font-normal dark:text-white dark:font-thin text-sm mt-4 text-start w-[90%] leading-5">
                  Our platform was created by fans, for fans, with a love of reading in mind. We provide easy access to awesome stories, while supporting authors with a constantly improving set of tools to help them succeed. Whether you&apos;re a reader or an author, you&apos;ll find a home here.
                </p>
            </div>

            <div className="flex flex-row gap-4 mt-8 bg-transparent text-gray-800 font-normal dark:font-thin dark:text-white ">
                  <a 
                    href="/"
                    className="
                                flex flex-row items-center justify-center gap-1 
                                w-32 p-2 
                              border-gray-800 dark:border-white border rounded-md
                              hover:bg-purple-700 hover:text-white hover:border-purple-700
                              "
                  >
                    <Book className="w-4 h-4"/>
                    Read Now
                  </a>
                  <a 
                    href="/write/new-book"
                    className="
                                flex flex-row items-center justify-center gap-1 
                                w-32 p-2 
                              border-gray-800 dark:border-white border text-center rounded-md
                              hover:bg-purple-700 hover:text-white hover:border-purple-700
                              "
                  >
                    <Pencil className="w-4 h-4"/>
                    Write Now
                  </a>
            </div>
        </div>

        <div className="flex relative items-center justify-center w-full h-96 lg:w-1/2">
            <Image 
              fill 
              className="object-cover w-full h-full mx-auto rounded-md lg:max-w-2xl" 
              src="/reading-hero.jpg" 
              alt="glasses photo" 
              sizes=" (max-width: 6888px) 100vw,
                      (max-width: 4592px) 50vw,
                      50vw"
            />
        </div>
      </div>

      {/* Readers */}
      <div className="text-gray-800 dark:text-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-600 dark:[#7C4DFF]">Incredible experience</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A Home for Readers
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-8 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {readerFeatures.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400 dark:font-light">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Writers */}
      <div className="text-gray-800 dark:text-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-600 dark:text-purple-400">Phenomenal results</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A Home for Writers
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="flex flex-row gap-20">
              <div className="hidden lg:flex relative items-center justify-center w-full h-96 lg:w-1/2">
                  <Image 
                    fill 
                    className="object-cover w-full h-full mx-auto rounded-md lg:max-w-2xl" 
                    src="https://images.unsplash.com/photo-1543269664-7eef42226a21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="glasses photo"
                    sizes=" (max-width: 1200px) 100vw,
                            (max-width: 800px) 50vw,
                            33vw"
                  />
              </div>
              
              <div className="w-full lg:w-1/2 flex justify-items-center">
                <dl className="grid max-w-xl grid-cols-1 gap-y-8 lg:max-w-none lg:gap-y-10">
                  {writerFeatures.map((feature) => (
                    <div key={feature.name} className="relative pl-16">
                      <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                        <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400 dark:font-light">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container flex flex-col px-6 py-10 mx-auto lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
                <h1 className="text-3xl font-bold tracking-wide text-gray-800 dark:text-white lg:text-5xl">
                    Let&apos;s start your journey!
                </h1>
                
                <p className="text-gray-800 font-normal dark:text-white dark:font-thin text-sm mt-4 text-start w-[90%] leading-5">
                Join our literary community and embark on a journey like no other. Whether you&apos;re a reader or a writer, Nexus is the gateway to a world of untold stories. Don&apos;t wait any longer to take the first step - join us today and let the magic of literature transport you to new horizons!
                </p>
            </div>
        </div>

        <div className="w-full lg:w-1/2 mb-10 flex justify-center">
          <div className="lg:max-w-lg">
            <h2 className="text-xl font-semibold mt-4 tracking-wide text-gray-800 dark:text-white lg:text-3xl text-center">
              Choose your path
              <p className="text-gray-800 font-normal tracking-normal dark:text-white dark:font-thin text-sm leading-5 text-center">
              (Don&apos;t worry, you can do both!)
              </p>
            </h2>
            <div className="flex flex-row gap-4 mt-2 bg-transparent text-gray-800 font-normal dark:font-thin dark:text-white ">
                  <a 
                    href="/"
                    className="
                                flex flex-row items-center justify-center gap-1 
                                w-32 p-2 
                              border-gray-800 dark:border-white border rounded-md
                              hover:bg-purple-700 hover:text-white hover:border-purple-700
                              "
                  >
                    <Book className="w-4 h-4"/>
                    Read Now
                  </a>
                  <a 
                    href="/nexus-auth/write/new-book"
                    className="
                                flex flex-row items-center justify-center gap-1 
                                w-32 p-2 
                              border-gray-800 dark:border-white border text-center rounded-md
                              hover:bg-purple-700 hover:text-white hover:border-purple-700
                              "
                  >
                    <Pencil className="w-4 h-4"/>
                    Write Now
                  </a>
            </div>
          </div>
        </div>
      </div>              

    </div>
  );
}