import { LibraryBook } from "@/validations/backend/library";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { CaretRight, CaretUpDown, Check, DotsThreeVertical, X } from "@phosphor-icons/react";
import { ReadingStatus } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { UnexpectedProblemModal } from "./UnexpectedProblemModal";
import Link from 'next/link'

interface ListBookItemProps {
  book: LibraryBook
  onChange?: (newStatus: ReadingStatus, id: string) => void
  onDelete?: (id: string) => void
  onSuccess?: () => void
  onError?: () => void
}

type option = {
  value: ReadingStatus,
  label: string
}

const readingOptions: option[] = [
  {
    value: ReadingStatus.TOREAD,
    label: 'To read'
  },
  {
    value: ReadingStatus.READING,
    label: 'Reading'
  },
  {
    value: ReadingStatus.READ,
    label: 'Read'
  },
  {
    value: ReadingStatus.REREADING,
    label: 'Re reading'
  },
  {
    value: ReadingStatus.DROPPED,
    label: 'Dropped'
  }
]

export function ListBookItem({book, onChange, onDelete, onSuccess, onError}: ListBookItemProps) {
  const router = useRouter()
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(readingOptions.find(op => op.value === book.status))
  

  function handleMoreOptions(e: React.MouseEvent<HTMLDivElement>) {
    console.log('handleMoreOptions')
    e.preventDefault()
    setOptionsOpen(!optionsOpen)
    // e.stopImmediatePropagation()
  }

  function handleSelectedStatus(newStatus: option) {
    onChange && onChange(newStatus.value, book.id)
    axios.patch('/api/library',  {
      bookId: book.id,
      status: newStatus.value
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      onSuccess && onSuccess()
    })
    .catch(err => {
      onError && onError()
    })
  }

  function handleRemoveBookFromLibrary() {
    onDelete && onDelete(book.id)
    axios.delete('/api/library', {
      data: {
        bookId: book.id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      onSuccess && onSuccess()
    })
    .catch(err => {
      onError && onError()
    })
  }

  return (
    <li
      className="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-gray-14 dark:hover:bg-gray-3 cursor-pointer lg:cursor-auto"
      // onClick={() => router.push(`/read/${book.id}`)}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-x-2">
          <div className="relative h-28 w-20">
            <Image fill src="/nexus-book-placeholder.png" sizes="100 200" alt={book.title}/>
          </div>
          <div className="flex flex-col p-2">
            <p className="text-lg font-medium leading-5 text-gray-1 dark:text-gray-15">
              {book.title}
            </p>
            <div 
              className="text-sm [&>p]:my-1 text-gray-3 dark:text-gray-12 font-light max-w-2xl max-h-16 overflow-auto scrollbar-thin scrollbar-thumb-nexus-9 dark:scrollbar-thumb-nexus-11 scrollbar-track-gray-12"
              dangerouslySetInnerHTML={{__html: book.synopsis}}
            />
          </div>
        </div>

        <ul className="mt-2 flex space-x-1 text-xs font-normal leading-4 text-gray-7">
          <li>by {book.author}</li>
          <li>&middot;</li>
          <li>{book.totalChapters} chapters</li>
          <li>&middot;</li>
          <li>{book.totalReviews} reviews ({book.score})</li>
        </ul>
      </div>

      <a
        href={`/read/${book.id}`}
        className={`
          hidden lg:flex
          group/edit invisible relative items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-gray-6 transition hover:bg-nexus-5 group-hover/item:visible
        `}
      >
        <span className="font-normal transition group-hover/edit:text-nexus-11">Read</span>
        <CaretRight className="h-5 w-5 text-gray-6 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-nexus-11" />
      </a>
      
      <Menu as="div" className="absolute top-1 right-1">
      <Menu.Button className="dark:text-gray-15 p-1 hover:bg-gray-12 dark:hover:bg-gray-5 rounded-full z-50">
        <DotsThreeVertical weight="bold" className="w-6 h-6"/>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 p-2 w-56 z-10 origin-top-right rounded-md bg-white dark:bg-gray-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <Listbox value={selectedStatus} onChange={handleSelectedStatus}>
              <div className="relative mt-1">
                <Listbox.Button className="
                  relative w-full cursor-default rounded-lg bg-white dark:bg-gray-3 border dark:border-gray-2 py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm
                "
                >
                  <span className="absolute left-2 text-gray-1 dark:text-gray-15 font-light">Status:</span>
                  <span className="block truncate pl-11 dark:text-gray-15">{selectedStatus?.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <CaretUpDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-3 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {readingOptions.map((status, idx) => (
                      <Listbox.Option
                        key={idx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-nexus-14 text-nexus-9' : 'text-gray-900 dark:text-gray-15'
                          }`
                        }
                        value={status}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {status.label}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-nexus-6 dark:text-nexus-11">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link
              className={`flex w-full items-center rounded-md px-2 py-2 gap-x-2 text-sm lg:hidden text-gray-1 dark:text-gray-15`}
              href={`/read/${book.id}`}
            >
              Read <span className="font-light text-nexus-8 dark:text-nexus-11">{book.title.length > 20 ? book.title.slice(20) + '...' : book.title}</span> 
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`flex w-full items-center rounded-md px-2 py-2 gap-x-2 mt-4 text-sm text-red-500`}
              onClick={handleRemoveBookFromLibrary}
            >
              <X className="w-5 h-5"/>
              Remove 
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
    </li>
  );
}