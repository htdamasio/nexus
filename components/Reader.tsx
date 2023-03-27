import { TextEditor } from "./TextEditor";
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'

interface ReaderProps {
  content?: string
}

export function Reader({content = ''}: ReaderProps) {
  return (
    <>
      <TextEditor 
        editable={false} 
        content={content}
        className="
        w-full px-3 pt-2 pb-5 text-sm font-light 
        border-0  z-10
        focus:outline-none 
        bg-transparent
        focus:ring-nexus-10 focus:border-nexus-10
        dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
        dark:focus:ring-nexus-11 dark:focus:border-nexus-11
        min-h-[12rem]"
      />
      <div className="sticky bottom-4 right-8 z-20 flex flex-row justify-center md:justify-end">
        <div className="flex items-center gap-2 bg-gray-15 dark:bg-gray-4 px-1 py-2 rounded-lg mr-4">
          <button 
            type="button"
            className="flex text-sm gap-x-1 text-gray-1 dark:text-gray-15"
          >
            <ArrowLeft className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
            <label>Previous Chapter</label>
          </button>
          <button 
            type="button"
            className="flex text-sm gap-x-1 text-gray-1 dark:text-gray-15"
          >
            <label>Next Chapter</label>
            <ArrowRight className="w-5 h-5 text-nexus-8 dark:text-nexus-11"/>
          </button>
        </div>
      </div>
    </>
  );
}