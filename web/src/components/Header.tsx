"use client"
import React from 'react'

import { usePathname } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
  return (
    <div className={`${pathname == "/" ? "":"border-b-[1px]"} flex items-center justify-between px-3 py-3 bg-gradient-to-br from-indigo-50 via-white to-purple-50` }>
        <div className='font-bold text-2xl'>Title</div>
        {pathname  == "/" ?""
        :
        <div className='text-sm'>Project Description</div>
      }
        <div></div>
    </div>
  )
}

export default Header