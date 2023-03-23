"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "flowbite-react";
import Image from "next/image";
import { Info } from "phosphor-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AddBookForm,addBookSchema } from "@/forms/addBookForm";
import { Genre, Tag } from "@prisma/client";
import useSWR from 'swr'
import { BookGenres } from "@/components/BookGenres";
import { BookTags } from "@/components/BookTags";
import { TextEditor } from "@/components/TextEditor";

interface WriteProps {
  genres: Genre[],
  tags: Tag[],
  success: boolean
}

// export const getServerSideProps: GetServerSideProps<> = async () => {
//   const res = await fetch('/api/bookDefinitions', {method: 'GET'})
//   console.log('Teste', res)
//   const data: WriteProps  = await res.json();
//   console.log(res, data)
//   return {
//     props: {
//       genres: [],
//       tags: []
//     }
//   }
// }

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Write() {
  const {register, handleSubmit, control, watch, setError, formState: { errors }} = useForm<AddBookForm>({resolver: zodResolver(addBookSchema)})
  const cover = watch("cover");
  // const synopsis = watch("synopsis");

  function handleAddBookSubmit(data: AddBookForm) {
    console.log(data)
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
                <label htmlFor="cover-file">
                  <Image 
                    width={200}
                    height={300}
                    src={cover ? URL.createObjectURL(cover) : '/nexus-book-placeholder.png'}
                    alt={cover ? cover.name : 'Insert image here'}
                  /> 
                </label>
              <p className="font-light text-red-400 text-sm mt-1">{errors.cover?.message}</p>
          </div>

          {/* Book title */}
          <div className="flex-1 flex flex-col gap-y-10">
            <div>
                <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Title</label>
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
              {/* <textarea
                // value={synopsis}
                // onChange={e => setSynopsis(e.target.value)}
                rows={8}
                placeholder="A brief introduction for the book"
                className="
                    w-full px-3 py-2 text-sm font-light
                    placeholder-gray-9 
                    border border-gray-12 
                    rounded-md focus:outline-none 
                    focus:ring-nexus-10 focus:border-nexus-10
                    dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                   dark:focus:ring-nexus-11 dark:focus:border-nexus-11"
                   {...register('synopsis')} 
              /> */}
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
                  min-h-[12rem]"
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
                  onChange={(string) => console.log('description -> ', string)}
                  menuJustify="end"
                  content="<h1>Teste</h1>"
                  // {...register("synopsis")}
                />
              {/* <div className="flex flex-row flex-1 justify-between items-center"> */}
                <p className="font-light text-red-400 text-sm mt-1">{errors.synopsis?.message}</p>
                {/* <p className=" text-gray-1 dark:text-gray-15 text-sm">{synopsis?.length > 0 ? synopsis.split(' ').length : 0} Words</p> */}
              {/* </div> */}

            </div>
          </div>
        </div>

        {/* genre and tags */}
        <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Genre</label>
              <div className="flex flex-row flex-1">
              {/* <Controller
                  name="selectedGenres"
                  control={control}
                  render={({ field }) => (
                    <BookGenres 
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
                /> */}
              </div>
              <p className="font-light text-red-400 text-sm mt-1">{errors.selectedGenres?.message}</p>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Tags</label>
              <p className="font-light text-red-400 text-sm mt-1">{errors.selectedTags?.message}</p>
              {/* Normal Tags */}
              <div className="flex flex-col flex-1">
                {/* <Controller
                    name="selectedTags"
                    control={control}
                    render={({ field }) => (
                      <BookTags 
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
                  /> */}
              </div>
            </div>

        </div>
        
        {/* add chapter */}
        <div className="flex flex-col gap-y-5">
          <label htmlFor="email" className="block mb-2 text-xl text-gray-1 dark:text-gray-15">First Chapter</label>
          <div>
            <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Chapter title</label>
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
                placeholder="Your first chapter title"
                {...register("chapterTitle")}
            />
            <p className="font-light text-red-400 text-sm mt-1">{errors.chapterTitle?.message}</p>
          </div>
          <div className="">
            <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Chapter Content</label>
            {/* <textarea
              rows={10}
              placeholder="The content for your first chapter"
              className="
                  w-full px-3 py-2
                  placeholder-gray-9 
                  border border-gray-12 
                  rounded-md focus:outline-none
                  bg-white 
                  focus:ring-nexus-10 focus:border-nexus-10
                  dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
                  dark:focus:ring-nexus-11 dark:focus:border-nexus-11" 
              {...register("chapterContent")}
            /> */}
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
                  min-h-[12rem]"
                  menuItems={[
                    'undo',
                    'redo',
                    'divider',
                    'heading_1',
                    'heading_2',
                    'heading_3',
                    'heading_4',
                    'divider',
                    'font_size',
                    'font_family',
                    'divider',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'clear_format',
                    'text_color',
                    'divider',
                    'blockquote',
                    'horizontal_rule',
                    'image',
                    'divider',
                    'align_left',
                    'align_center',
                    'align_right',
                    'justify',
                  ]}
                  onChange={(string) => console.log('chapter -> ', string)}
                  menuJustify="start"
                  // {...register("chapterContent")}
                />
            <p className="font-light text-red-400 text-sm mt-1">{errors.chapterContent?.message}</p>
            {/* <p className="flex flex-row flex-1 justify-end text-gray-1 dark:text-gray-15 text-sm">{synopsis.length > 0 ? synopsis.split(' ').length : 0} Words</p> */}
            
          </div>
          <div>
          {/* /**
          * Undo
          * Redo
          * Bold
          * Italic
          * Underline
          * Strikethrough
          * Clear formating
          * Insert line
          */}
          </div>
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
        <div className="mb-20 -mt-5 lg:mb-10 lg:mt-0 flex flex-row flex-1 justify-center">
          <button 
            type="submit"
            className="flex-1 py-3 px-2 rounded 
                      bg-nexus-9 text-gray-1
                      dark:bg-nexus-11 "  
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}