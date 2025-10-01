const AuthImagePattern = ({ title, Subtitle}) => {
    return <> 
       <div className="hidden lg:flex items-center justify-center  ">
         <div className="max-w-sm  text-center">
           {/* Grid Pattern */}
           <div className="grid grid-cols-3 gap-2 mb-4">
           {
            [...Array(9)].map((_,i ) =>{
                return(
                    <div key={i} className={`aspect-square rounded-3xl bg-gray-700/50  ${i % 2 === 0 ? 
                      "animate-pulse" : "" } `}> 
                        </div>
                )
            })
           }
           </div>
           <h2 className=" text-xl font-bold text-black mb-4">{title} </h2>
           <p className="text-gray-700">{Subtitle}</p>
         </div>
       </div>
    </>
};

export default AuthImagePattern;