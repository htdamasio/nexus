"use client"
import { ListBookItem } from "@/components/ListBookItem";
import { Spinner } from "@/components/Spinner";
import { UnexpectedProblemModal } from "@/components/UnexpectedProblemModal";
import { GetLibraryResponse, LibraryBook } from "@/validations/backend/library";
import { Tab } from "@headlessui/react";
import { CaretRight, Scroll } from "@phosphor-icons/react";
import { ReadingStatus, Review } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from 'swr'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Library(){
  const { data, error } = useSWR(`/api/library/`, fetcher, { revalidateOnFocus: false })
  const [libraryBooks, setLibraryBooks] = useState<GetLibraryResponse>()
  const [oldLibraryBooks, setOldLibraryBooks] = useState<GetLibraryResponse>()
  const [unexpectedError, setUnexpectedError] = useState(false)

  useEffect(() => {
    if(data && data.response) {
      setLibraryBooks(data.response)
      setOldLibraryBooks(data.response)
    }
  }, [data])

  if (error) return <div>Error...</div>
  if (!data) return (
    <div className="absolute top-0 w-full h-screen bg-gray-15 dark:bg-gray-1">
      <Spinner size='sm' />
    </div>
  )
  // const libraryBooks: GetLibraryResponse = data.response 
  console.log(libraryBooks)
  // let [categories] = useState({
  //   Recent: [
  //     {
  //       id: 1,
  //       title: 'Does drinking coffee make you smarter?',
  //       date: '5h ago',
  //       commentCount: 5,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 2,
  //       title: "So you've bought coffee... now what?",
  //       date: '2h ago',
  //       commentCount: 3,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 3,
  //       title: 'Does drinking coffee make you smarter?',
  //       date: '5h ago',
  //       commentCount: 5,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 4,
  //       title: "So you've bought coffee... now what?",
  //       date: '2h ago',
  //       commentCount: 3,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 5,
  //       title: 'Does drinking coffee make you smarter?',
  //       date: '5h ago',
  //       commentCount: 5,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 6,
  //       title: "So you've bought coffee... now what?",
  //       date: '2h ago',
  //       commentCount: 3,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 7,
  //       title: 'Does drinking coffee make you smarter?',
  //       date: '5h ago',
  //       commentCount: 5,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 8,
  //       title: "So you've bought coffee... now what?",
  //       date: '2h ago',
  //       commentCount: 3,
  //       shareCount: 2,
  //     },
  //   ],
  //   Popular: [
  //     {
  //       id: 1,
  //       title: 'Is tech making coffee better or worse?',
  //       date: 'Jan 7',
  //       commentCount: 29,
  //       shareCount: 16,
  //     },
  //     {
  //       id: 2,
  //       title: 'The most innovative things happening in coffee',
  //       date: 'Mar 19',
  //       commentCount: 24,
  //       shareCount: 12,
  //     },
  //   ],
  //   Trending: [
  //     {
  //       id: 1,
  //       title: 'Ask Me Anything: 10 answers to your questions about coffee',
  //       date: '2d ago',
  //       commentCount: 9,
  //       shareCount: 5,
  //     },
  //     {
  //       id: 2,
  //       title: "The worst advice we've ever heard about coffee",
  //       date: '4d ago',
  //       commentCount: 1,
  //       shareCount: 2,
  //     },
  //   ],
  //   Other: [
  //     {
  //       id: 1,
  //       title: 'Ask Me Anything: 10 answers to your questions about coffee',
  //       date: '2d ago',
  //       commentCount: 9,
  //       shareCount: 5,
  //     },
  //     {
  //       id: 2,
  //       title: "The worst advice we've ever heard about coffee",
  //       date: '4d ago',
  //       commentCount: 1,
  //       shareCount: 2,
  //     },
  //   ],
  // })
  
  function getCategory(category: string) {
    const splittedString = category.split(/(?=[A-Z])/);
    
    if(splittedString.length > 1) {
      return splittedString[0].charAt(0).toUpperCase() + splittedString[0].slice(1) + ' ' + splittedString[1]
    } else {
      return category.charAt(0).toUpperCase() + category.slice(1)
    }

  }

  function getKey(status: ReadingStatus) {
    switch(status) {
      case "TOREAD": return 'toRead'
      case "READING": return 'reading'
      case "READ": return 'read'
      case "REREADING": return 'reading'
      case "DROPPED": return 'dropped'
    }
  }

  function handleBookReadingStatusChange(newStatus: ReadingStatus, bookId: string, ArrayKey: string) {
    const localLibrary = {...libraryBooks}
    const book = localLibrary[ArrayKey].find(book => book.id === bookId)
    localLibrary[ArrayKey] = localLibrary[ArrayKey].filter(book => book.id != bookId)
    
    book.status = newStatus
    localLibrary[getKey(newStatus)].push(book)
    
    setLibraryBooks(localLibrary)
    // console.log(newStatus, bookId, libraryBooks[ArrayKey])
  }

  function handleRemoveBookFromLibrary(bookId: string, ArrayKey: string) {
    const localLibrary = {...libraryBooks}
    localLibrary[ArrayKey] = localLibrary[ArrayKey].filter(book => book.id != bookId)
    setLibraryBooks(localLibrary)
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row flex-1 font-roboto w-11/12 mx-auto mt-10 max-w-7xl">
    {libraryBooks && 
    
    <Tab.Group vertical>
      <Tab.List className="flex flex-row md:flex-col min-w-[10rem] ml-1 gap-y-1 rounded-xl bg-gray-15 dark:bg-gray-1 p-1 overflow-auto">
        {Object.keys(libraryBooks).map((category) => (
          <Tab
            key={category}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-1 dark:text-gray-15',
                'ring-0 focus:outline-none',
                selected
                  ? 'bg-gray-13 dark:bg-gray-5 shadow !text-nexus-9 dark:!text-nexus-11'
                  : 'hover:bg-gray-13 hover:text-nexus-9 dark:hover:bg-gray-5 dark:hover:text-nexus-11'
              )
            }
          >
            {getCategory(category)}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mx-2 md:w-full max-h-[80%] overflow-auto">
        {Object.entries(libraryBooks).map((books, idx) => (
          <div key={idx}>
          {books[1].length > 0 ?
          <Tab.Panel
            key={idx}
            className={classNames(
              'rounded-xl bg-white dark:bg-gray-2 p-3',
              'ring-0 focus:outline-none'
            )}
          >
            <ul>
              {books[0] === 'reviews' &&
                <div>Teste</div>
              }
              {books[0] != 'reviews' && books[1].map((book) => (
                <ListBookItem 
                  key={book.id} 
                  book={book as LibraryBook} 
                  onChange={(newStatus, id) => handleBookReadingStatusChange(newStatus, id, books[0])}
                  onDelete={(id) => handleRemoveBookFromLibrary(id, books[0])}
                  onSuccess={() => setOldLibraryBooks(libraryBooks)}
                  onError={() => {
                      setUnexpectedError(true)
                      setLibraryBooks(oldLibraryBooks)
                    }
                  }
                />
              ))}
            </ul>
          </Tab.Panel>
          :
          <Tab.Panel className="h-full w-full rounded-xl bg-white dark:bg-gray-2 p-3">
            <div className="flex-1 h-full w-full flex flex-row gap-x-3 justify-center items-center font-light dark:font-regular text-gray-9 dark:text-gray-7">
              <Scroll weight="light" className="w-10 h-10"/> 
              <p>
                There is nothing here!
              </p>
            </div>
          </Tab.Panel>
          }
          </div>
        ))}
      </Tab.Panels>
    </Tab.Group>
    }
    <UnexpectedProblemModal isOpen={unexpectedError} onDismiss={setUnexpectedError}/>
  </div>
  );
}