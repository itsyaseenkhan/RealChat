import React from 'react';
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <> 
      <div className="w-full flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-8 bg-white/70">
        <div className="w-full max-w-sm sm:max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 flex items-center justify-center animate-bounce">
                <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-700">
            Welcome to YaariZone
          </h1>
          <p className="text-sm sm:text-base text-gray-500 px-2">
            Select a conversation from the sidebar to start chatting now.
          </p>
        </div>
      </div>
    </>
  );
};

export default NoChatSelected;
