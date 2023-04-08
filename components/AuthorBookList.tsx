import { Book, BookStatus } from "@prisma/client";
import Image from "next/image";
import { useState, Fragment } from "react";
import { Spinner } from "./Spinner";
import { Divide, Pencil, X } from "phosphor-react";
import { Dialog, Transition } from "@headlessui/react";
import { Tooltip } from "flowbite-react";
import { useRouter } from 'next/navigation'
import { Badge } from "./Badge";
import { getBadgeColor, getBadgeContent } from "@/utils/frontend/badge";
import { Check } from "@phosphor-icons/react";

interface AuthorBookListProps {
  books: Book[],
  onDelete: (id: string) => void
  onChangeStatus: (id: string, newStatus: BookStatus) => void
}

export function AuthorBookList({ books, onDelete, onChangeStatus }: AuthorBookListProps) {
  const router = useRouter();
  const [bookToDelete, setBookToDelete] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedToDelete, setSelectedToDelete] = useState('')
  const [changingStatus, setChangingStatus] = useState(false)


  function getNumberOfComments(numberOfComments: []) {
    return numberOfComments.reduce((acc, item) => {
      return acc + item._count.comments;
    }, 0)
  }

  function handleDelete() {
    const bookId = bookToDelete;
    setIsDeleting(true)
    setSelectedToDelete(bookToDelete)
    setBookToDelete('');

    fetch(`/api/books/${bookId}`, {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'DELETE'
    })
    .then(res => {
      onDelete(bookId)  
      setIsDeleting(false)
      setSelectedToDelete('')
    })
    .catch(err => {
      // TODO: Unexpected Error Modal
      setIsDeleting(false)
    })
    
  }

  function changeBookStatus(status: BookStatus, bookId: string) {
    setChangingStatus(true)
    fetch(`/api/books/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    })
    .then(res => {
      onChangeStatus(bookId, status)
      setChangingStatus(false)
    })
    .catch(err => {
      setChangingStatus(false)
      // TODO: handle error
    })
  }

  return (
    <>
    <ol className="grid grid-cols-1 lg:grid-cols-2 gap-y-5 px-1 md:px-3 max-h-[28rem] overflow-auto">
      {books?.map((book: Book) => {
        return (
          <li 
            key={book.id}
            className="relative w-full h-full"
          >
            {/* Card */}
            <Badge 
              content={
                <div className="flex flex-row gap-x-2 items-center">
                  {getBadgeContent(book.status)}
                  {changingStatus && 
                    <Spinner 
                      size={3}
                      weight="thin"
                    />
                  }
                </div>
              } 
              color={getBadgeColor(book.status)}
            >
              <div className="relative flex flex-row rounded-md overflow-hidden m-2 bg-gray-14 dark:bg-gray-3 shadow-md dark:shadow-black gap-x-2">
                <div className="w-auto">
                  <Image
                    width={150}
                    height={225} 
                    src={book.cover.length > 0 ? book.cover : '/nexus-book-placeholder.png'} alt={book.title}/>  
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-2">
                  <div>
                    <div className="flex flex-row flex-1 justify-between">
                      <div className="text-2xl text-gray-1 dark:text-gray-15 font-normal">{book.title}</div>
                      {isDeleting && book.id === selectedToDelete && 
                          <div className="flex flex-row gap-x-2 items-center font-normal py-0.5 px-2 text-red-600">
                            Deleting
                            <Spinner full={false} size={4} weight="thin" color="red"/>
                          </div>
                        }
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex flex-1 justify-between">
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Reviews</span>
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">{book?._count.reviews}</span>
                      </div>
                      <div className="flex flex-1 justify-between">
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Comments</span>
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">{getNumberOfComments(book.chapters)}</span>
                      </div>
                      {/* <div className="flex flex-1 justify-between">
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">Likes</span>
                        <span className="font-light text-gray-2 dark:text-gray-14 text-sm">245</span>
                      </div> */}
                    </div>
                  </div>

                  {['NEEDADJUST', 'REJECTED'].find(status => status === book.status) && 
                  <div className="flex flex-col flex-1 my-1">
                    <p className="text-base text-gray-2 dark:text-gray-13">Admin notes</p>
                    <span 
                      className="
                        font-light overflow-y-scroll max-h-28 leading-[1.15rem] 
                        text-gray-2 
                        dark:text-gray-13
                      "
                      >
                      {book.adminNotes}
                      </span>
                  </div>
                  }
                
                  {/* Card Actions */}
                  <div className="flex flex-row justify-end px-3 gap-x-3 items-center">
                    {['ONGOING', 'COMPLETED'].find(status => status === book.status) && 
                      <div className="flex flex-1">
                      <Tooltip content={book.status === BookStatus.ONGOING ? 'Mark book as completed':'Mark book as ongoing'}>
                        <button
                          onClick={() => changeBookStatus(book.status === BookStatus.ONGOING ? BookStatus.COMPLETED : BookStatus.ONGOING, book.id)}
                          className="justify-self-start rounded-xl p-1 hover:bg-green-300 text-green-500 hover:text-green-700"
                        >
                          <Check className="w-6 h-6"/>
                        </button>
                      </Tooltip>
                      </div>
                    }

                    <Tooltip content="Edit book">
                      <button
                        onClick={() => router.push(`/nexus-auth/write/${book.id}`)}
                        className="items-center rounded-xl p-1 hover:bg-blue-300 text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="w-6 h-6"/>
                      </button>
                    </Tooltip>
                    
                    {/* <Tooltip content="Add chapter">
                      <button>
                        <Plus className="w-6 h-6 text-green-500"/>
                      </button>
                    </Tooltip> */}
                    
                    <Tooltip content="Delete book">
                      <button 
                        onClick={() => setBookToDelete(book.id)}
                        className="rounded-xl p-1 hover:bg-red-300 text-red-500 hover:text-red-700"
                      >
                          <X className="w-6 h-6"/>
                      </button>
                    </Tooltip>
                  </div>                        
                </div>        
              </div>
            </Badge>

          </li>
        )
      })}
    </ol>
    <Transition appear show={bookToDelete.length > 0} as={Fragment}>
      <Dialog
        open={bookToDelete.length > 0}
        onClose={() => setBookToDelete('')}
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
                    You really want to delete the Book?
                    <X className="w-5 h-5 text-red-600 cursor-pointer" onClick={() => setBookToDelete('')}/>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm font-normal dark:font-light text-gray-1 dark:text-gray-14">
                      This is an acction that cannot be undone. Be aware that <strong>all your work</strong> will be <strong className="text-red-600">lost</strong> if you proceed! 
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
                      
                      onClick={() => setBookToDelete('')}
                    >
                      Do not delete
                    </button>
                    
                    <button
                      type="button"
                      className="
                      w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
                      border-red-600 text-red-600 enabled:hover:bg-red-600 enabled:hover:text-gray-14
                      dark:font-light dark:border-red-600 dark:text-red-500 enabled:dark:hover:bg-red-600 enabled:dark:hover:text-gray-14
                      "
                      onClick={handleDelete}
                    >
                      Delete
                      </button>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    </>
  );
}