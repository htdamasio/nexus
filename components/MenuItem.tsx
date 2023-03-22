import React from 'react'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import { MenuItem } from './MenuBar'
import { Icon } from '@phosphor-icons/react'


export function MenuItem({ icon, title, action, isActive = null}: MenuItem) {
  return (
    <button
      type='button'
      className={`
        bg-transparent border-0 rounded-lg h-7 mr-1 p-1 w-7 
        text-gray-2 hover:bg-gray-13
        dark:text-gray-14 dark:hover:bg-gray-1 
        ${isActive && isActive() ? '!bg-gray-13 dark:!bg-gray-1 ' : ''}`}
      onClick={action}
      title={title}
    >
      {icon}
    </button>
  )
}