"use client"

import { Sidebar } from "@/components/Sidebar";
import { Tooltip } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { DotsThreeVertical, Pencil, Plus, PlusCircle, X } from "phosphor-react";
import { useState } from "react";

const books = [
  {
    title: "Mother of Learning",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "qweqw-asdas23-234fe23-r34r3f2-43efasd"
  },
  {
    title: "asdasd",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "qweqw-x98cv7x-234fe23-r34r3f2-43efasd"
  },
  {
    title: "",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "qweqw-asdas23-0zxc9v8-r34r3f2-43efasd"
  },
  {
    title: "",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "qweqw-asdas23-234fe23-21y3oi-43efasd"
  },
  {
    title: "",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "109a8sd0-asdas23-234fe23-r34r3f2-43efasd"
  },
  {
    title: "",
    cover: "https://www.royalroadcdn.com/public/covers-full/21220-mother-of-learning.jpg?time=1637247458",
    id: "qweqw-asdas23-12379asd-r34r3f2-43efasd"
  }
]


export default function AuthorDashboard() {
  const [editMenu, setEditMenu] = useState(false)
  return (
    <div className="lg:h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-10 font-roboto w-11/12 mx-auto mt-10 max-w-7xl">
      
      <div className="bg-white h-fit self-center dark:bg-gray-2 dark:shadow-black shadow rounded-lg p-4 sm:p-6 xl:p-8 col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
              <h3 className="text-xl font-bold text-gray-1 dark:text-gray-15 mb-2">Your Books</h3>
              <span className="text-base font-normal text-gray-7 dark:text-gray-8">Here you can add and edit books</span>
          </div>
          <div className="flex-shrink-0">
              <Link 
                className="
                            text-sm font-medium text-nexus-8 dark:text-nexus-11 
                            p-2 border border-nexus-8 dark:border-nexus-11 rounded-lg
                            dark:hover:bg-nexus-11 dark:hover:text-gray-1 hover:bg-nexus-8 hover:text-gray-15
                            flex flex-row gap-1 items-center
                          "
                  href="/nexus-auth/write"
                >
                {/* <Tooltip content="Add a book" > */}
                  <Plus weight="bold" className="w-4 h-4"/>
                  Add Book
                {/* </Tooltip> */}
              </Link>
          </div>
        </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
                <div className="align-middle inline-block min-w-full">
                  <div className="shadow overflow-hidden sm:rounded-lg">
                      <ol className="grid grid-cols-1 lg:grid-cols-2 gap-y-5 px-3 max-h-[28rem] overflow-auto">
                        {books.map(book => {
                          return (
                            <li 
                              key={book.id}
                              className="relative w-full h-full"
                            >
                              {/* Card */}
                              <div className="relative flex flex-row rounded-md overflow-hidden m-2 bg-gray-14 dark:bg-gray-3 shadow-md dark:shadow-black gap-x-2">
                                <div className="w-auto">
                                  <Image
                                    width={100}
                                    height={150} 
                                    src={book.cover} alt={book.title}/>  
                                </div>
                                
                                <div className="flex flex-1 flex-col justify-between p-2">
                                  <div>
                                    <h1 className="text-gray-1 dark:text-gray-15 font-normal">{book.title}</h1>
                                    <div className="flex flex-col">
                                      <div className="flex flex-1 justify-between">
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Rating</span>
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">4.5/5</span>
                                      </div>
                                      <div className="flex flex-1 justify-between">
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Comments</span>
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">27</span>
                                      </div>
                                      <div className="flex flex-1 justify-between">
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Likes</span>
                                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">245</span>
                                      </div>
                                    </div>
                                  </div>
                                
                                  {/* Card Actions */}
                                  <div className="flex flex-row justify-evenly">
                                    <Tooltip content="Edit book">
                                      <button
                                        onClick={() => setEditMenu(!editMenu)}
                                      >
                                        <Pencil className="w-6 h-6 text-blue-500"/>
                                      </button>
                                    </Tooltip>
                                    
                                    <Tooltip content="Add chapter">
                                      <button>
                                        <Plus className="w-6 h-6 text-green-500"/>
                                      </button>
                                    </Tooltip>
                                    
                                    <Tooltip content="Delete book">
                                      <button>
                                          <X className="w-6 h-6 text-red-500"/>
                                      </button>
                                    </Tooltip>
                                  </div>                        
                                </div>        
                              </div>

                            </li>
                          )
                        })}
                      </ol>
                  </div>
                </div>
            </div>
          </div>
      </div>

      <div className="w-full col-span-1 gap-4 flex flex-col items-center justify-center p-4 mb-16 lg:p-0 lg:mb-0">
        <div className="bg-white dark:bg-gray-2 shadow rounded-lg p-4 sm:p-6 xl:p-8 w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                  <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-1 dark:text-gray-15">2,340</span>
                  <h3 className="text-base font-normal text-gray-7 dark:text-gray-8">New products this week</h3>
              </div>
              <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                  14.6%
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
              </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-2 shadow rounded-lg p-4 sm:p-6 xl:p-8 w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                  <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-1 dark:text-gray-15">5,355</span>
                  <h3 className="text-base font-normal text-gray-7 dark:text-gray-8">Visitors this week</h3>
              </div>
              <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                  32.9%
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
              </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-2 shadow rounded-lg p-4 sm:p-6 xl:p-8 w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                  <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-1 dark:text-gray-15">385</span>
                  <h3 className="text-base font-normal text-gray-7 dark:text-gray-8">User signups this week</h3>
              </div>
              <div className="ml-5 w-0 flex items-center justify-end flex-1 text-red-500 text-base font-bold">
                  -2.7%
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
              </div>
            </div>
        </div>
      </div>
      <Sidebar open={editMenu}>
        <div className="top-14 right-0 w-[26vw] bg-gray-14 dark:bg-gray-2 shadow-lg text-white fixed h-full ">
          <header className="p-2 flex flex-row flex-1 justify-between items-center">
            <h1 className="text-xl text-gray-1 dark:text-gray-15">
              Edit Book
            </h1>
            <X 
              className="w-6 h-6 text-red-500 cursor-pointer"
              onClick={() => setEditMenu(false)}
            />
          </header>
          <main className="p-2">
            <form action="">
              <div className="mb-4">
                  <label htmlFor="title" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                  <input 
                    type="text"  
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" 
                    placeholder="youremail@gmail.com"
                    // {...register("email")}
                  />
                  {/* <p className="font-light text-red-400 text-sm mt-1">{errors.email?.message}</p> */}
              </div>
            </form>
          </main>
          <footer>

          </footer>
          {/* <h2 className="text-4xl font-semibold text-white">I am a sidebar</h2> */}
          
        </div>
      </Sidebar>
    </div>
  );
}