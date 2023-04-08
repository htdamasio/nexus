"use client"
import { TextEditor } from "./TextEditor";
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { Book } from '@prisma/client'
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

interface ReaderProps {
  content?: string,
  book?: Book,
}

type ChapterContent = {
  content: string,
  id: string,
  // order: number
}

export function Reader({content = '', book = undefined}: ReaderProps) {
  const [currentContent, setCurrentContent] = useState(content)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [chaptersContent, setChaptersContent] = useState<ChapterContent[]>([])
  const [loadingChapter, setLoadingChapter] = useState(false)

  useEffect(() => {
    if (book) {
      loadChapter()
    }
  }, [])

  useEffect(() => {
    chapterAlreadyLoaded()
  }, [currentChapterIndex])

  function getPreviousChapter() {
    if(book && currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex)
      // chapterAlreadyLoaded()
    }
  }

  function getNextChapter() {
    if (book && currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }
  
  function chapterAlreadyLoaded() {
    const currentChapter = book.chapters[currentChapterIndex];
    const chapterFound = chaptersContent.find(ch => ch.id === currentChapter.id)
    if(chapterFound) {
      setCurrentContent(chapterFound.content)
    } else {
      loadChapter();
    }
  }

  async function loadChapter() {
    if (book) {
      setLoadingChapter(true)
      setCurrentContent(defaultHeader)
      const currentChapter = book.chapters[currentChapterIndex];
      const { chapter } = await fetch(`/api/books/${book.id}/chapters/${currentChapter.id}`).then(res => res.json())
      const content = await fetch(chapter.url).then(r => r.text());

      let response = defaultHeader + `
        <h2>${chapter.title}</h2>
        ${content} `;

      setCurrentContent(response)
      setChaptersContent([...chaptersContent, {
        content: response,
        id: currentChapter.id
      }])
      setLoadingChapter(false)
    }
  }

  const defaultHeader = 
    book ? 
    `
    <h1>${book.title}</h1>
    <p>by ${book?.author?.name}</p>
    <hr/>
    ` 
    : 
    ''

  return (
    <>
      <TextEditor
        forceContent={true} 
        editable={false} 
        content={currentContent}
        className="
        w-full px-3 pt-2 pb-5 text-sm font-light 
        border-0 z-10
        focus:outline-none 
        bg-transparent
        focus:ring-nexus-10 focus:border-nexus-10 text-gray-1
        dark:bg-gray-1 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
        dark:focus:ring-nexus-11 dark:focus:border-nexus-11
        min-h-[12rem]"
      />
      { !loadingChapter &&
      <div className="sticky bottom-4 right-8 z-20 flex flex-row justify-center md:justify-end">
        <div className="flex items-center gap-2 bg-gray-15 dark:bg-gray-4 px-1 py-2 rounded-lg mr-4">
          <button 
            type="button"
            className="
            flex text-sm gap-x-1 text-gray-1 dark:text-gray-15
            disabled:cursor-not-allowed disabled:text-gray-8
            "
            onClick={getPreviousChapter}
            disabled={currentChapterIndex <= 0}
          >
            <ArrowLeft className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
            <p>Previous Chapter</p>
          </button>

          {/* Acctual Chapter {currentChapterIndex} */}

          <button 
            type="button"
            className="
            flex text-sm gap-x-1 text-gray-1 dark:text-gray-15 
            disabled:cursor-not-allowed disabled:text-gray-8
            "
            onClick={getNextChapter}
            disabled={currentChapterIndex >= book.chapters.length - 1}
          >
            <p>Next Chapter</p>
            <ArrowRight className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
          </button>
        </div>
      </div>
      }
      {
      loadingChapter &&
        <div className="absolute top-0 w-full h-screen bg-gray-15 dark:bg-gray-1">
          <div className="w-full h-full flex flex-1 items-center justify-center">
            <div className="flex flex-col gap-y-2">
              <Spinner size='sm' />
              <p className="
                font-normal text-nexus-8
                dark:font-light dark:text-nexus-11  
              "
              >
                Loading the chapter
              </p>
            </div>
          </div>
        
        </div>
      }
    </>
  );
}