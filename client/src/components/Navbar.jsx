import React from 'react';
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/slices/authSlice";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className='fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-sm'>
      <div className='max-w-7xl mx-auto px-10 h-16 flex items-center justify-between'>
        
        {/* Left Logo */}
        <Link to={"/"} className='flex items-center gap-3.5 hover:opacity-80 transition'>
          <div className='w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center'>
            <MessageSquare className='w-5 h-5 text-blue-900' />
          </div>
          <h1 className='text-lg font-bold text-gray-800'>YaariZone</h1>
        </Link>

        {/* Right Actions */}
        <div className='flex items-center gap-3'>
          {authUser && (
            <>
              {/* Profile Link */}
              <Link to={"/Profile"}
                className='inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition'
              >
                <User className='w-5 h-5' />
                <span className='hidden sm:inline'>Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition'
              >
                <LogOut className='w-5 h-5 text-red-500' />
                <span className='hidden sm:inline text-red-500'>LogOut</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
