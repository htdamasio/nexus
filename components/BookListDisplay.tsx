import { useEffect, useState } from "react";
import { AuthorBookList } from "./AuthorBookList";
import useSWR from 'swr'
import { Spinner } from "./Spinner";
import { Scroll } from "@phosphor-icons/react";
import { Book, BookStatus } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function BookListDisplay() {
  const [books, setBooks] = useState<Book[]>([])
  const { data, error } = useSWR('/api/books', (url) => fetcher(url), { revalidateOnFocus: false })

  useEffect(() => {
    if(data) {
      setBooks(data.books);
    }
  }, [data])

  if (error) return <div>Error...</div>
  if (!data) return <Spinner size='sm'/>
  
  function handleDelete(id: string) {
    setBooks(books.filter(b => b.id !== id)); 
  }

  function handleBookChangeStatus(id: string, newStatus: BookStatus) {
    setBooks(books.map(b => {
      if(b.id === id) {
        b.status = newStatus
      }
      return b
    })); 
  }

  return (
    <div className={`flex flex-col ${(books && books.length) ? 'mt-8': ''} flex-1 h-full`}>
        {
          books && books.length > 0 &&
        <div className="overflow-x-auto rounded-lg flex-1">
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden sm:rounded-lg">
                  <AuthorBookList  books={books} onDelete={handleDelete} onChangeStatus={handleBookChangeStatus}/>
              </div>
            </div>
        </div>
      }
      {!books || books.length === 0 &&
        <div className="flex-1 h-full w-full flex flex-row gap-x-3 justify-center items-center font-light dark:font-regular text-gray-12 dark:text-gray-5">
          <Scroll weight="light" className="w-10 h-10"/> 
          <p>
            You do not have any books yet!
          </p>
        </div>
      }
      </div>
  );
}