import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefualtAvatar  from "../assets/images.png";
import { setSelectedUser } from '../Store/slices/chatSlice';
import { X, MoreVertical, Trash } from "lucide-react";
import { ClearChat } from '../Store/slices/chatSlice'; 

const ChatHeader = () => {
  const { selectedUser } = useSelector((state) =>  state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearChat = () => {
    if(!selectedUser?._id) return;
    if(window.confirm("Are you sure you want to clear this chat?")) {
      dispatch(ClearChat(selectedUser._id));
      setDropdownOpen(false); 
    }
  }

  return (
    <div className='p-3 border-b bg-gray-100'>
      <div className='flex items-center justify-between'>
        {/* User Info */}
        <div className='flex items-center gap-3'>
          <div className='relative w-10 h-10'>
            <img 
              src={selectedUser?.Avatar?.url || DefualtAvatar } 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
            />  
            {onlineUsers.includes(selectedUser?._id) && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-white border-2 rounded-full'></span>
            )}
          </div>

          <div>
            <h1 className='font-medium text-base text-black'>{selectedUser?.FullName}</h1>
            <p className='text-sm text-gray-600'>
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2 relative'>
          {/* Dropdown toggle */}
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className='p-2 hover:bg-gray-200 rounded-full transition'
          >
            <MoreVertical className='w-5 h-5' />
          </button>

          {/* Close Chat */}
          <button 
            onClick={() => dispatch(setSelectedUser(null))} 
            className='p-2 hover:bg-gray-200 rounded-full transition'
          >
            <X className='w-5 h-5' />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              ref={dropdownRef} 
              className='absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-lg z-10'
            >
              <button 
                onClick={handleClearChat} 
                className='w-full text-left px-8 flex items-center gap-1 hover:bg-gray-200 transition'
              >
                <span>CLear Chats</span>
              </button>
             
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader;
