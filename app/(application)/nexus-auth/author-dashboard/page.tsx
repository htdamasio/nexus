"use client"

import { Sidebar } from "@/components/Sidebar";
import { UnexpectedProblemModal } from "@/components/UnexpectedProblemModal";

import { Scroll, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { Plus, X } from "phosphor-react";
import { Fragment, useEffect, useState } from "react";

import { AuthorBookList } from "@/components/AuthorBookList";
import { BookListDisplay } from "@/components/BookListDisplay";
 


export default function AuthorDashboard({searchParams}: {searchParams?: { bookAdded: boolean }}) {
  
  return (
    <>
    <div className="fixed top-28 flex flex-row flex-1 w-full items-center justify-center">
      <div className="bg-blue-200 px-10 rounded-xl flex flex-row gap-x-2 items-center">
        <WarningCircle className="w-8 h-8" />
        There are many more features to come in the near future  
      </div>
    </div>
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-10 font-roboto w-11/12 mx-auto mt-10 max-w-7xl">
      <div className="min-h-[24rem] bg-white h-fit self-center dark:bg-gray-2 dark:shadow-black shadow rounded-lg p-4 sm:p-6 xl:p-8 col-span-3 flex flex-col">
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
                  href="/nexus-auth/write/new-book"
                >
                {/* <Tooltip content="Add a book" > */}
                  <Plus weight="bold" className="w-4 h-4"/>
                  Add Book
                {/* </Tooltip> */}
              </Link>
          </div>
        </div>
          <BookListDisplay />
      </div>
    </div>
    </>
  );
}