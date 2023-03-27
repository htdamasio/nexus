import { Fragment, useState } from "react";
import { TextEditor } from "./TextEditor";
import { Controller } from "react-hook-form";
import { Dialog, Transition } from '@headlessui/react'
import { X } from "@phosphor-icons/react";

interface ChapterAddProps {
  onPreview?: null | ((id: string) => void)
  onDelete?: (index: number ) => void,
  id: string,
  index: number;
  register: any;
  errors: any;
  control: any
  content: string,
  last: boolean
}

export function ChapterAdd({onPreview = null, id, onDelete, content, index, register, errors, control, last}: ChapterAddProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-row lg:justify-end items-center">
        {/* <label htmlFor="email" className="block mb-2 text-xl text-gray-1 dark:text-gray-15">First Chapter</label> */}
        <button 
            type="button"
            className="
              w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
              border-nexus-9 text-nexus-9 hover:bg-nexus-9 hover:text-gray-12
              dark:font-light dark:border-nexus-11 dark:text-nexus-11 dark:hover:bg-nexus-11 dark:hover:text-gray-14
            "
            onClick={() => onPreview && onPreview(id)}
          >
          Chapter Preview
        </button>
      </div>

      {/* Title + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-3">
        <div className="col-span-1">
          <label htmlFor="email" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Chapter title</label>
          <input 
            type="text"  
            className="
              w-full px-3 py-2 text-sm font-light
              placeholder:text-gray-7 
              dark:placeholder:text-gray-9
              border border-gray-12 
              rounded-md focus:outline-none 
              focus:ring-nexus-10 focus:border-nexus-10
              dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
              dark:focus:ring-nexus-11 dark:focus:border-nexus-11" 
              placeholder="Your chapter title"
              name={`chapters[${index}].title`}
              {...register(`chapters[${index}].title`)}
          />
          <p className="font-light text-red-400 text-sm mt-1">{errors.chapters && errors.chapters[index]?.title?.message}</p>
        </div>
        <div className="col-span-2">
          <label htmlFor="authorNotes"  className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Notes</label>
            <textarea
              rows={5}
              placeholder="If you need you can let some notes for your chapter here..."
              className="
                  w-full px-3 py-2 font-light text-sm
                  placeholder:text-gray-10
                  dark:placeholder:text-gray-7
                  placeholder:font-light
                  placeholder:text-sm
                  border border-gray-12 
                  rounded-md focus:outline-none
                  bg-white 
                  focus:ring-nexus-10 focus:border-nexus-10
                  dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 dark:font-light
                  dark:focus:ring-nexus-11 dark:focus:border-nexus-11" 
              {...register(`chapters[${index}].notes`)}
            />
        </div>
      </div>
      
      {/* Content */}
      <div >
        <label htmlFor="" className="block mb-2 text-lg text-gray-1 dark:text-gray-15">Chapter Content</label>  
        <Controller
          name={`chapters[${index}].content`}
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
              min-h-[12rem] max-h-[24rem] overflow-auto"
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
                // 'text_color',
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
              content={content}
              onChange={(string) => field.onChange(string)} 
              menuJustify="start"
            />
          )}
        />           
        <p className="font-light text-red-400 text-sm mt-1">{errors.chapters && errors.chapters[index]?.content?.message}</p>
      </div>
      <div className="flex flex-row w-full lg:justify-end">
        <button 
            type="button"
            disabled={last}
            className="
              disabled:cursor-not-allowed 
              w-full lg:w-auto text-sm font-normal py-0.5 px-2 border rounded-md
              border-red-600 text-red-600 enabled:hover:bg-red-600 enabled:hover:text-gray-14
              dark:font-light dark:border-red-600 dark:text-red-500 enabled:dark:hover:bg-red-600 enabled:dark:hover:text-gray-14
            "
            onClick={() => setConfirmDelete(true)}
            // onClick={() => onDelete && onDelete(index)}
          >
          Delete chapter
        </button>
      </div>

    <Transition appear show={confirmDelete} as={Fragment}>
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
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
                    You really want to delete the chapter?
                    <X className="w-5 h-5 text-red-600 cursor-pointer" onClick={() => setConfirmDelete(false)}/>
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
                      
                      onClick={() => setConfirmDelete(false)}
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
                      onClick={() => onDelete && onDelete(index)}
                    >
                      Delete
                    </button>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    </div>
  );
}