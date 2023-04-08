"use client"
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { Book, BookStatus } from '@prisma/client'
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";
import { getBadgeColor, getBadgeContent } from "@/utils/frontend/badge";
import Image from "next/image";
import { Tooltip } from "flowbite-react";
import { BookOpen, Check, Gear, X } from "@phosphor-icons/react";
import { Reader } from "@/components/Reader";
import { bookGenresFetcher } from "@/utils/frontend/fetchers";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { TextEditor } from "@/components/TextEditor";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type selectedAction = {
  book: Book,
  action: BookStatus
}

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([])  
  const [selectedBook, setSelectedBook] = useState<Book>()
  const [selectedAction, setSelectedAction] = useState<selectedAction>()
  
  const { data, error } = useSWR('/api/userAdmin/books/onapproval', fetcher, { revalidateOnFocus: false })

  useEffect(() => {
    if(!!data && data.books) {
      setBooks(data.books)
    }
  }, [data])
  
  if (error) return <div>Error...</div>
  if (!data) return <Spinner size='sm' />
  // console.log(data)

  // function proccedToAction() {
  //   setSelectedAction('')
  // }

  function handleSelectedAction(action: BookStatus, book: Book) {
    setSelectedAction({
      book,
      action
    })
  }

  function getTitleByAction() {
    if(selectedAction?.action) {
      switch(selectedAction.action) {
        // case "COMPLETED":
        case "ONGOING": return "You realy want to proceed with this book APPROVAL?"
        // case "ONAPPROVAL": return "You realy want to proceed with this book APPROVAL?"
        case "REJECTED": return "You realy want to proceed with this book REJECTION?"
        case "NEEDADJUST": return "You realy want to proceed with this book ADJUST?"
      }
    }
  }

  function proccedToAction() {
    const book = selectedAction?.book;
    const action = selectedAction?.action;
    setSelectedAction(undefined)
    if(book && action) {
      fetch(`/api/userAdmin/books/changeStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          id: book.id,
          notes: book.adminNotes,
          newStatus: action
        })
      })
      .then(res =>  {
        if(action === BookStatus.ONGOING) {
          setBooks(books.filter(b => b.id != book.id))
        }
        // console.log('Action performed')
      })
      .catch(err => {
        alert('Some error happened, try again later')
      })
    }
  }

  function handleAdminNotesChange(value: string, id: string) {
    setBooks(books.map(b => {
      if (b.id === id) {
        b.adminNotes = value
      }
      return b
    }))
  }

  // const books: Book[] = data.books 
  return (
    <div className="text-white">
      {/* ADMIN PAGE */}

      {books.map(book => {
        return (
          <div key={book.id} className={`mx-3 mb-2 last:pb-14 md:last:pb-14 ${books.length === 1 ? 'pb-14 md:pb-0' : ''}`}>
             <Badge content={getBadgeContent(book.status)} color={getBadgeColor(book.status)}>
              <div className="relative flex flex-col md:flex-row rounded-md overflow-hidden m-2 bg-gray-14 dark:bg-gray-3 shadow-md dark:shadow-black gap-x-2">
                <div className="flex md:ml-5 items-center justify-center mt-3 md:mt-0">
                  <div className="w-auto h-full max-w-[150px] max-h-56">
                    <Image
                      width={150}
                      height={225} 
                      src={book.cover.length > 0 ? book.cover : '/nexus-book-placeholder.png'} alt={book.title}/>  
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col justify-center p-2">
                  {/* Book title */}
                  <div className="flex flex-row flex-1 justify-center md:justify-between">
                    <div className="flex items-center gap-x-2 text-2xl text-gray-1 dark:text-gray-15 font-normal">
                      {book.title}
                    </div>
                  </div>

                  {/* Tags and Genres */}
                  <div className="flex flex-col max-w-full gap-y-1">

                  <div className="flex w-full flex-wrap gap-y-1 gap-x-2 justify-center md:justify-start">
                  {book.genres.map(g => {
                    return (
                      <div key={g.name} className="flex items-center justify-center rounded-full p-2 bg-blue-500 text-[.6rem] text-gray-1">
                        {g.name} 
                      </div>
                    )
                  })}
                  </div>

                  <div className="flex flex-wrap gap-y-1 gap-x-2 justify-center md:justify-start">
                  {book.tags.map(t => {
                    return (
                      <div key={t.name} className="flex items-center justify-center rounded-full p-2 bg-pink-500 text-[.6rem] text-gray-1">
                        {t.name} 
                      </div>
                    )
                  })}
                  </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2">
                    {/* Synopsis */}
                    <div className="col-span-1">
                      <p className="block mt-1 text-lg text-gray-1 dark:text-gray-15">Synopsis</p>
                      <TextEditor 
                      content={book.synopsis + book.synopsis + book.synopsis + book.synopsis+book.synopsis+book.synopsis}
                      forceContent={true}
                      editable={false}
                      className="
                        text-sm font-light text-gray-1 dark:text-gray-15
                        min-h-[12rem] max-h-[12rem] overflow-auto
                      "
                      /> 
                    </div>
                    {/* Admin notes */}
                    <div className="col-span-2 flex flex-1 justify-center">
                      <textarea
                        name="adminNotes" 
                        id=""  
                        rows={10}
                        placeholder="Write your notes for the author"
                        className="
                          w-full md:mr-3 mt-2 rounded-md font-light
                          ring-0 focus:ring-nexus-8 focus:border-nexus-8 border-gray-10 bg-gray-13
                          dark:focus:ring-nexus-11 dark:focus:border-nexus-11 dark:bg-gray-5
                          
                          text-gray-1 dark:text-gray-14

                          placeholder:text-base placeholder:font-light placeholder:font-roboto placeholder:text-gray-8
                        "
                        value={book.adminNotes ?? ''}
                        onChange={e => handleAdminNotesChange(e.target.value, book.id)}
                      >
                      </textarea>
                    </div>
                  </div>
                
                  {/* Card Actions */}
                  <div className="flex flex-row justify-end px-3 gap-x-3 mt-2 items-center">
                    <Tooltip content="View book">
                      <button
                        // onClick={() => router.push(`/nexus-auth/write/${book.id}`)}
                        onClick={() => setSelectedBook(book)}
                        className="rounded-xl p-1 hover:bg-blue-300 text-blue-500 hover:text-blue-700"
                      >
                        {/* View */}
                        <BookOpen className="w-6 h-6"/>
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Accept book">
                      <button
                        // onClick={() => approveBook(book)}
                        onClick={() => handleSelectedAction(BookStatus.ONGOING, book)}
                        className="rounded-xl p-1 hover:bg-green-300 text-green-500 hover:text-green-700"
                      >
                        {/* View */}
                        <Check className="w-6 h-6"/>
                      </button>
                    </Tooltip>

                    <Tooltip content="Book need fix">
                      <button 
                        // onClick={() => setBookToDelete(book.id)}
                        onClick={() => handleSelectedAction(BookStatus.NEEDADJUST, book)}
                        className="rounded-xl p-1 hover:bg-pink-300 text-pink-500 hover:text-pink-700"
                      >
                          <Gear className="w-6 h-6"/>
                      </button>
                    </Tooltip>

                    <Tooltip content="Reject book">
                      <button 
                        // onClick={() => setBookToDelete(book.id)}
                        onClick={() => handleSelectedAction(BookStatus.REJECTED, book)}
                        className="rounded-xl p-1 hover:bg-red-300 text-red-500 hover:text-red-700"
                      >
                          <X className="w-6 h-6"/>
                      </button>
                    </Tooltip>
                  </div>                        
                </div>        
              </div>
            </Badge>
          </div>
        )
      })} 

      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        isModalOpen={selectedAction ? true : false}
        title={getTitleByAction()} //"You realy want to proceed with this action?"
        body="Make sure you are doing the right decision!"
        onConfirm={proccedToAction}
        onClose={() => setSelectedAction(undefined)}
      />
      {/* Show Book */}
      <div 
        className={`
          overflow-auto z-20
          fixed left-0 -bottom-[100%] w-full h-[100%] bg-gray-15 border-gray-1 dark:bg-gray-1 border-t-2 dark:border-gray-15 transition ease-in-out delay-150
          ${selectedBook ? '-translate-y-full' : 'translate-y-full'}
        `}
      > 
        <div className="sticky top-0 bg-gray-14 text-gray-1 dark:bg-gray-3 dark:text-gray-15 dark:font-light z-20 flex flex-row justify-end px-4 py-2">
          {/* <p>This is how users will see your text</p> */}
          <button 
            type="button" 
            onClick={() => setSelectedBook(undefined)}
          >
            <X className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
          </button>
        </div>
        <div>
          {selectedBook && 
            <Reader book={selectedBook}/>
          }
        </div>
      </div> 
    </div>
  );
}