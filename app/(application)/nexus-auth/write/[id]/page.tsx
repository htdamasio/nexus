"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "flowbite-react";
import Image from "next/image";
import { CaretUp, Divide, Info, Plus, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { AddBookForm,AddChapterForm,addBookSchema } from "@/forms/addBookForm";
import { Genre, Tag } from "@prisma/client";
import useSWR from 'swr'
import { BookGenres } from "@/components/BookGenres";
import { BookTags } from "@/components/BookTags";
import { TextEditor } from "@/components/TextEditor";
import { useSession } from "next-auth/react";
import { Reader } from "@/components/Reader";
import { ChapterAdd } from "@/components/ChapterAdd";
import { Disclosure } from '@headlessui/react'
import crypto from 'crypto';
import axios from "axios";
import { Spinner } from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { UnexpectedProblemModal } from "@/components/UnexpectedProblemModal";

interface WriteProps {
  genres: Genre[],
  tags: Tag[],
  success: boolean
}
const fetcher = (url: string, bookId: string|null|undefined) => {
  if (typeof bookId === 'string') {
    return  fetch(url).then((res) => res.json())
  } else {
    const book = {}
    const success = false;
    return JSON.stringify({book, success})
  }
};

export default function Write({ params }: {params?: { id: string }}) {
  const router = useRouter()
  const {data: session} = useSession()
  const {register, handleSubmit, control, watch, setError, setValue, formState: { errors }} = useForm<AddBookForm>({resolver: zodResolver(addBookSchema)})
  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters",
  });
  const chapters = useWatch({
    control,
    name: "chapters", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: [] // default value before the render
  });
  
  const cover = watch("cover");
  const synopsis = watch("synopsis");
  const title = watch("title");  
  const selectedGenres = watch("selectedGenres");  
  const selectedTags = watch("selectedTags");  

  const [preview, setPreview] = useState('')
  const [submitingForm, setSubmitingForm] = useState(false)
  const [unexpectedErrorModalOpen, setUnexpectedErrorModalOpen] = useState(false)

  const bookId = params?.id === 'new-book' ? null : params?.id;
  const { data, error } = useSWR([`/api/books/${bookId}`, bookId], ([url, bookId]) => fetcher(url, bookId), { revalidateOnFocus: false })

  useEffect(() => {
    if (data && data?.book) {
      console.log('Receive the info -> ', data.book)
      setValue("title", data.book.title);
      setValue("synopsis", data.book.synopsis);
      setValue("cover", data.book.cover);
      setValue("selectedGenres", data.book.genres);
      setValue("selectedTags", data.book.tags);
      setValue("chapters", data.book.chapters);
    }
  }, [data])

  if (error) return <div>Error...</div>
  if (!data) return <Spinner size='sm' />

  async function handleAddBookSubmit(data: AddBookForm) {
    setSubmitingForm(true);

    if (bookId) {
      console.log(data)
    } else {
      const formData:any = new FormData();
      if(data.cover)
        formData.append('files', data.cover);
        
      data.chapters?.forEach(async c => {
        var chapter = new Blob([c.content], {type: 'text/plain'});

        formData.append('files', chapter, c.title);
      })
      formData.append("genres", data.selectedGenres)
      formData.append("tags", data.selectedTags)
      formData.append("synopsis", data.synopsis)
      formData.append("title", data.title)
      // formData.append("email", session?.user?.email ?? '')

      data.chapters.forEach(item => {
        const chapter = {
          id: item.id,
          title: item.title,
          content: '',
          notes: item.notes
        }
        if (data.chapters.length === 1) {
          formData.append("chapters", [JSON.stringify(chapter)])
        } else {
          formData.append("chapters", JSON.stringify(chapter))
        }
      })
      axios.post("/api/upload", formData, {headers: {'content-type': 'multipart/form-data'}})
      .then(res => {
        setSubmitingForm(false)
        router.push('/nexus-auth/author-dashboard?bookAdded=true')
        // redirect to author-dashboard
      })
      .catch(err => {
        setSubmitingForm(false)
      
        if (err.response.status === 406) {
          alert('Missing files')
        } else {
          setUnexpectedErrorModalOpen(true)
        }
      })
    }
  }
  function getPreviewContent() {
    const chapter = chapters.find(c => c.id === preview)
    let response = `
      <h1>${title.length ? title : 'Book Title'}</h1>
      <p>by ${session?.user?.name}</p>
      <hr/>
    `
    if(chapter) {
      return response + `
      <h2>${chapter.title.length ? chapter.title : 'Chapter Title'}</h2>
      ${chapter.content}`;
    } else {
      return response + `<h2>Chapter Title</h2>`; 
    }
  }

  function addChapter() {
    const chapterKey = typeof window !== 'undefined' ? window.crypto.randomUUID() : crypto.randomUUID();
    const chapter: AddChapterForm = {
      id: chapterKey,
      content: '',
      notes: '',
      title: ''
    }
    append(chapter)
  }

  return (
    <div className="font-roboto w-11/12 mx-auto mt-10 max-w-7xl">
      <form onSubmit={handleSubmit(handleAddBookSubmit)} className="flex flex-col gap-y-10">
        <div className="flex flex-1 flex-col lg:flex-row gap-y-10 lg:gap-x-10">
          {/* Cover */}
          <div className="flex-1">
              <label htmlFor="cover" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Book cover</label>
                <Controller
                  name="cover"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <input 
                      className="block w-full mb-5 text-xs text-gray-1 border border-gray-12 rounded-lg cursor-pointer bg-gray-14 dark:text-gray-10 focus:outline-none dark:bg-gray-2 dark:border-gray-5 dark:placeholder-gray-8" 
                      type="file" 
                      id="cover-file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.length ? e.target.files[0] : null)}
                    />
                  )}
                />
                <label htmlFor="cover-file" className="w-auto">
                  <Image 
                    width={200}
                    height={300}
                    src={cover ? 
                            (typeof cover === 'string' ? cover :
                      URL.createObjectURL(cover)) : '/nexus-book-placeholder.png'}
                    alt={cover ? (cover.name ? cover.name : title) : 'Insert image here'}
                  /> 
                </label>
              <p className="font-light text-red-400 text-sm mt-1">{errors.cover?.message}</p>
          </div>

          {/* Book title */}
          <div className="flex-1 flex flex-col gap-y-10">
            <div>
                <label className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Title</label>
                <input 
                  type="text"  
                  className="
                    w-full px-3 py-2 text-sm font-light
                    placeholder-gray-9 
                    border border-gray-12 
                    rounded-md focus:outline-none 
                    focus:ring-nexus-10 focus:border-nexus-10
                    dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                   dark:focus:ring-nexus-11 dark:focus:border-nexus-11" 
                  placeholder="Your book title"
                  {...register("title")}
                />
                <p className="font-light text-red-400 text-sm mt-1">{errors.title?.message}</p>
            </div>

            {/* Book synopsys */}
            <div>
              <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Synopsis</label>
                { (!bookId || (bookId && synopsis && synopsis.length)) && 
                 <Controller
                  name={`synopsis`}
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextEditor 
                      className="
                      w-full px-3 pt-2 pb-5 text-sm font-light
                      placeholder-gray-9 
                      border border-gray-12 
                      rounded-md focus:outline-none 
                      bg-white
                      focus:ring-nexus-10 focus:border-nexus-10
                      dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                      dark:focus:ring-nexus-11 dark:focus:border-nexus-11
                      min-h-[12rem] max-h-[12rem] overflow-auto"
                      menuItems={[
                        'undo',
                        'redo',
                        'divider',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'divider',
                        'clear_format',
                        'horizontal_rule',
                      ]}
                      onChange={(string) => field.onChange(string)}
                      menuJustify="end"
                      // editable={false}
                      content={synopsis}
                    />
                  )}
                />  
                }         
                <p className="font-light text-red-400 text-sm mt-1">{errors.synopsis?.message}</p>
            </div>
          </div>
        </div>

        {/* genre and tags */}
        <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Genre</label>
              <div className="flex flex-col flex-1">
              <Controller
                  name="selectedGenres"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <BookGenres 
                      alreadyChecked={selectedGenres}
                      onChange={e => {
                          const isChecked = e.target.checked
                          let prevValues = field.value;

                          if(!prevValues) prevValues = []

                          if (isChecked) {
                            prevValues.push(parseInt(e.target.value))
                          } else {
                            const index = prevValues.indexOf(parseInt(e.target.value))
                            prevValues.splice(index, 1)
                          }

                          field.onChange(prevValues)
                        }} 
                    />
                  )}
                />
              </div>
              <p className="font-light text-red-400 text-sm mt-1">{errors.selectedGenres?.message}</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-x-3 mb-2">
              <label htmlFor="email" className="block text-lg text-gray-1 dark:text-gray-15">Tags</label>
              <p className="font-light text-red-400 text-sm mt-1">{errors.selectedTags?.message}</p>
              </div>
              {/* Normal Tags */}
              <div className="flex flex-col flex-1">
                <Controller
                    name="selectedTags"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <BookTags
                        alreadyChecked={selectedTags}
                        onChange={e => {
                          const isChecked = e.target.checked
                          let prevValues = field.value;

                          if(!prevValues) prevValues = []

                          if (isChecked) {
                            prevValues.push(parseInt(e.target.value))
                          } else {
                            const index = prevValues.indexOf(parseInt(e.target.value))
                            prevValues.splice(index, 1)
                          }

                          field.onChange(prevValues)
                        }}  
                      />
                    )}
                  />
              </div>
            </div>
        </div>
        
        
        <div className="flex w-full flex-col">
          <div className="flex fles-row w-full justify-between items-center">
            <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Chapters</label>
            <button type="button" className="mr-4 rounded-xl text-nexus-11 p-1 hover:bg-nexus-12 hover:text-nexus-9">
              <Plus weight="bold" className="w-5 h-5" onClick={addChapter}/>
            </button>
          </div>
          
          <div className="flex flex-col gap-y-1">
          {chapters?.map((chapter, index) => 
            <Disclosure key={chapter.id}>
              <Disclosure.Button
                  data-id={chapter.id}
                  className="
                    flex w-full justify-between first:rounded-t-lg last:rounded-b-lg
                    px-4 py-2 text-left text-sm font-medium focus:outline-none
                    bg-gray-14 text-nexus-8 hover:bg-nexus-9 hover:text-gray-14
                    dark:bg-gray-3 dark:text-nexus-11 dark:hover:bg-nexus-10 dark:hover:text-gray-2 ">
                  {chapter.title.length > 0 ? chapter.title : `Unnamed Chapter`}
                  <CaretUp className="h-5 w-5 ui-open:rotate-180 ui-open:transform" />
                </Disclosure.Button>
                <Disclosure.Panel data-id={chapter.id} className="border p-3 rounded-b-lg border-gray-2 dark:border-gray-14">
                  <ChapterAdd
                      id={chapter.id} 
                      onPreview={(id) => setPreview(id)} 
                      onDelete={(id) => remove(index)}
                      control={control}
                      errors={errors}
                      index={index}
                      register={register}
                      content={chapter.content}
                      last={index === chapters.length-1}
                    />
                </Disclosure.Panel>
            </Disclosure>
            )}
          </div>
          <p className="font-light text-red-400 text-sm mt-1">{errors.chapters?.message}</p>
        </div>

        <Alert 
          className="-mt-5 justify-center items-center text-center"
          color="info"
        >
          <div className="flex flex-1 flex-row items-center gap-2">
            <Info className="w-28 h-28 lg:w-6 lg:h-6"/>
            <p>
              It can take <strong>up to 72 hours</strong> for a submission to be approved. If issues are found within the submission, it will be rejected and corrections will have to be made before re-submission.
            </p>
          </div>
        </Alert>
        <div className="mb-20 -mt-5 lg:mb-10 lg:mt-0 flex flex-row flex-1 justify-center gap-x-3">
          <button 
            type="submit"
            className="flex-1 py-3 px-2 rounded 
                      bg-nexus-9 hover:bg-nexus-8 hover:text-gray-12 text-gray-1
                      dark:bg-nexus-11 dark:hover:bg-nexus-9"  
          >
            <div className="flex flex-row flex-1 items-center gap-2 justify-center">
              {bookId ? 'Update': 'Submit'}
              {/* Submit */}
              {submitingForm && <Spinner size={4} weight="thin" full={false}/>}
            </div>
          </button>
            {bookId && 
              <button 
                onClick={() => router.back()}
                type="button"
                className="flex-1 py-3 px-2 rounded 
                      bg-red-500 hover:bg-red-600 hover:text-gray-14 text-gray-1
                      dark:bg-red-500 dark:hover:bg-red-600"
              >
                Cancel
              </button>
            }
        </div>
      </form>
      
      {/* Preview */}
      <div 
        className={`
          overflow-auto z-20
          fixed left-0 -bottom-[100%] w-full h-[100%] bg-gray-15 border-gray-1 dark:bg-gray-1 border-t-2 dark:border-gray-15 transition ease-in-out delay-150
          ${preview.length > 0 ? '-translate-y-full' : 'translate-y-full'}
        `}
      > 
        <div className="sticky top-0 bg-gray-14 text-gray-1 dark:bg-gray-3 dark:text-gray-15 dark:font-light z-20 flex flex-row justify-between px-4 py-2">
          <p>This is how users will see your text</p>
          <button type="button" onClick={() => setPreview('')}>
            <X className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
          </button>
        </div>
        <div>
          {preview.length > 0 && 
            <Reader content={getPreviewContent()}/>
          }
        </div>
      </div>

      {/* Error Modal */}
      <UnexpectedProblemModal isOpen={unexpectedErrorModalOpen} onDismiss={(value) => setUnexpectedErrorModalOpen(value)} />
    </div>
  );
}