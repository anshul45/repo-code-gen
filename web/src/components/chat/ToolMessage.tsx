import React from 'react'
import { Button } from '../ui/button'
import { Checkbox } from "@/components/ui/checkbox"

const ToolMessage = ({message,generateCode}:any) => {
  return (
    <div className='p-5 border-[1px] rounded-md text-sm bg-gray-100'>
      <div className='bg-white border-[1px] rounded-sm'>
      <div className='border-b-2 p-3 text-[15px] font-semibold'>Files to be Created.</div>
      {message.map(message => (<PreviewFiles file={message}/>))}
      </div>
      <Button onClick={generateCode} className='w-80'  style={{ backgroundColor: 'black', color: 'white', marginTop: "12px", marginRight: "8px" }}>Generate</Button>
    </div>
  )
}


const PreviewFiles = ({file}:any) => {
  return(
    <div className='p-3 flex items-center gap-2'>
      <Checkbox/>
    <div className='font-semibold'>{file?.file_path}</div>
    </div>
  )
}

export default ToolMessage