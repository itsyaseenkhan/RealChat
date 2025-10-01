import React from 'react'

function MessageSkeleton() {
  const SkeletonMessagesm = Array(6).fill(null);
  return (
    <>
         <div className='flex-1 overflow-y-auto Space-y-4'>
          {
            SkeletonMessagesm.map((_, index) =>{
             return(
              <div key={index} className={`flex items-start gap-3  ${index % 2 === 0 ? "justify-start" :  "justify-end" }  `}> </div>
             )

            })
          }

          {/* Avatar */}
          <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse'/>
          {/* message Bubbles */}

          <div>
            <div className='h-4 w-16 bg-gray-200 rounded mb-2 animate-'/>
            <div className='h-16 w-[200px] bg-gray-200 rounded-lg animate-pulse-'/>
          </div>
       </div>
    </>
  )
}

export default MessageSkeleton
