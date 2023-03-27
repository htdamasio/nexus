"use client"
import { Swatches } from "@phosphor-icons/react";
import { useState } from "react";
import { MenuItem } from './MenuBar'

export function MenuColor({ title, setAction, isSettedActive = null, options}: MenuItem) {
  const [colorSelected, setColorSelected] = useState('#000')
  const [togglePicker, setTogglePicker] = useState(false)
  return (
    <div className="relative">
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-400">
          <span className="flex items-center self-center pl-1">
            <div 
              className={`w-4 h-4 rounded shadow border`}
              style={{'background': colorSelected}}
              ></div>
          </span>
        </div>
        <input 
          readOnly
          type="text" 
          onBlur={() => setTogglePicker(!togglePicker)} 
          value={colorSelected}
          className="
          !ring-0 text-xs font-light 
          placeholder-gray-9 
          border border-gray-12 
          rounded-md focus:outline-none 
          focus:ring-nexus-10 focus:border-nexus-10
          dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
          dark:focus:ring-nexus-11 dark:focus:border-nexus-11
          p-1.5 pl-8 h-7 w-40"
        />
        <div className="absolute inset-y-0 right-0 flex items-center p-0.5">
          <button onClick={() => setTogglePicker(!togglePicker)} type="button" className="outline-none inline-flex justify-center items-center group transition-all ease-in duration-150 focus:ring-2 focus:ring-offset-2 hover:shadow-sm disabled:opacity-80 disabled:cursor-not-allowed gap-x-2 text-sm px-4 py-2     ring-primary-600 text-primary-600 hover:bg-primary-100
    dark:ring-offset-slate-800 dark:hover:bg-slate-700 dark:ring-primary-700 h-full rounded-r-md">
            {/* ICon here */}
            <Swatches className="w-5 h-5"/>
          </button>
        </div>
      </div>
      <div className={`
          fixed inset-0 z-20 flex items-end sm:z-10 sm:absolute sm:inset-auto transition-all ease-linear duration-150
          ${togglePicker ? 'block absolute left-4 top-16':'hidden'}    
      `}>
        <div className="w-full rounded-t-md sm:rounded-xl border border-secondary-200 bg-gray-14 dark:bg-gray-3 shadow-lg dark:bg-secondary-800 dark:border-secondary-600 transition-all relative overflow-hidden max-h-56 py-3 px-2 sm:py-2 sm:px-1 sm:w-72 overflow-y-auto soft-scrollbar">
          <div  
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-0.5 max-w-[18rem] mx-auto">
            <span className="sr-only">dropdow-open</span>
            {options?.map((c, index) => {
              return (
                <button 
                  className={`
                  w-6 h-6 rounded shadow-lg border hover:scale-125 transition-all ease-in-out duration-100 cursor-pointer
                  hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-gray-400
                  dark:border-0 dark:hover:ring-2 dark:hover:ring-gray-400
                  `}
                  style={{'background': c.val}}
                  onClick={() => {
                      setColorSelected(c.val)
                      setTogglePicker(false)
                      setAction && setAction(c.val)
                    }
                  }
                  key={index} 
                  type="button"
                  title={c.name}
                >

                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}