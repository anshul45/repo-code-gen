"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

interface FileContents {
  contents: string;
}

interface DirectoryContents {
  [key: string]: FileNode;
}

interface FileNode {
  file?: FileContents;
  directory?: DirectoryContents;
}

const Header = () => {
    const pathname = usePathname()
  return (
    <div className="flex items-center h-full pr-3">
        {pathname  == "/" ?""
        :
        <div className='text-sm ml-4'>Project Description</div>
        }
    </div>
  )
}

export default Header
