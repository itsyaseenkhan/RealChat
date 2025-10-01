import React from 'react';
import {MessageSquare} from "lucide-react"

 const  NoChatSelected = () =>{
  return (
    <> 
       <div className=' w-full flex flex-1 flex-col items-center justify-center p-8 bg-white/70' >
         <div className='max-w-md  text-center space-y-8 '>
          {/* icon */}
          <div className=' flex justify-center gap-4 mb-6'>
            <div className='relative'>
                <div className='w-16 h-16 rounded-2xl bg-blue-100 flex items-center  animate-bounce'>
                 <MessageSquare className='w-8 h-8  bg-blue-150 items-center justify-center ml-3.5'  />
                </div>
            </div>
          </div>
          {/* Text writer */}
                    <h1 className='text-xl font-stretch-50% font-bold mb-3 text-gray-600'>Welcome to YaariZone </h1>
                    <p className='text-gray-500    ' >
                    Select a Conversation from the Sidebar to Start Chetting Now 
                    </p>
         </div>
       </div>
    </>
  )
}

export default NoChatSelected
