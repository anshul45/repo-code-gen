import React from 'react'

const ToolMessage = ({message}:any) => {
  console.log(message[0])
  return (
    <div className='p-5 border-[1px] rounded-md text-sm bg-gray-100'>
      <div className='bg-white border-[1px] rounded-sm'>
      <div className='border-b-2 p-3 text-[15px] '>File Structure</div>
      {message.map(message => (<PreviewFiles file={message}/>))}
      </div>
    </div>
  )
}


const PreviewFiles = ({file}:any) => {
  return(
    <div className='p-3'>
<div className='font-semibold mb-2'>{file?.file_path}</div>
<div className='text-sm'>{file?.description}</div>
    </div>
  )
}

export default ToolMessage