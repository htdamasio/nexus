import React from 'react'
import { MenuItem } from './MenuBar'

export function MenuSelect({ title, setAction, defaultValue, isSettedActive = null, options}: MenuItem) {
  function setFont(font: string) {
    setAction ? setAction(font) : null
  }
  return (
    <select 
      className="
        !ring-0 text-xs font-light 
        placeholder-gray-9 
        border border-gray-12 
        rounded-md focus:outline-none 
        focus:ring-nexus-10 focus:border-nexus-10
        dark:bg-gray-2 dark:text-gray-15 dark:placeholder-gray-8 dark:border-gray-5 
        dark:focus:ring-nexus-11 dark:focus:border-nexus-11
        p-1.5 h-7 w-24"
      title={title} value={defaultValue} name="select" onChange={(e) => setFont(e.target.value)}>
      {options?.map((opt, index) => {
        return (
          <option 
            className="hover:!bg-nexus-10"
            style={{'fontStyle': opt.val}}
            key={index} 
            value={opt.val}
            title={opt.name}
          >  
            {opt.name}
          </option>
        )
      })}
    </select>
  );
}