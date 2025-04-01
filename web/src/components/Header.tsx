"use client"
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useFileStore } from '@/store/fileStore'
import { createProjectZip } from '@/lib/zipUtils'
import { Loader2 } from 'lucide-react'

const Header = () => {
  const pathname = usePathname()
  const [isDownloading, setIsDownloading] = useState(false)
  const files = useFileStore((state) => state.files)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      await createProjectZip(files)
    } catch (error) {
      console.error('Error creating zip file:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex items-center justify-between h-full px-3">
      <div>
        {pathname !== "/" && (
          <div className='text-sm'>Project Description</div>
        )}
      </div>
      
      {pathname !== "/" && (
        <Button 
          onClick={handleDownload}
          disabled={isDownloading}
          variant="outline"
          className="ml-auto"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            'Download Project'
          )}
        </Button>
      )}
    </div>
  )
}

export default Header
