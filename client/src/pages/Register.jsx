import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import {useDispatch, useSelector} from "react-redux"
import AuthImagePattern from '../components/AuthImagePattern';
import {Link} from "react-router-dom";
import {Signup} from "../Store/slices/authSlice";

const  Register = () => {
  const [showPassword,setShowPassword] =  useState(false);
  const [formData,  setFormData] = useState({
    FullName:"",
    Email: "",
    password:"",
  });
  const dispatch = useDispatch();

  const { isSigningUp} = useSelector(state => state.auth);

  const handleSubmit = (e) => {
       e.preventDefault();
      dispatch(Signup(formData));
  }
  return (
    < >
      <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white'>
        <div className='flex flex-col justify-center items-center px-6 py-12'>
           <div className='w-full max-w-md'>
          <div className='flex flex-col items-center text-center m-10'>
            <div className='bg-blue-100 p-3 rounded-lg'>
              <MessageSquare className='text-blue-600 w-6 h-6' />
            </div>
            <h1 className='text-2xl font-bold mt-4'>Create Account!</h1>
            <p className='text-gray-500 text-sm mt-2'>
              Get Started With Your free Account
            </p>
            </div>
               <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">FullName</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <User className="w-5 h-5" />
                              </span>
                              <input
                                type="text"
                                placeholder=" Enter Your FullName"
                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.FullName}
                                onChange={(e) =>
                                  setFormData({ ...formData, FullName: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail className="w-5 h-5" />
                              </span>
                              <input
                                type="email"
                                placeholder="example@gmail.com"
                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.Email}
                                onChange={(e) =>
                                  setFormData({ ...formData, Email: e.target.value })
                                }
                              />
                            </div>
                          </div>
              
                          {/* Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock className="w-5 h-5" />
                              </span>
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.password}
                                onChange={(e) =>
                                  setFormData({ ...formData, password: e.target.value })
                                }
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
              
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full bg-blue-600   hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center m items-center   gap-10"
                          >
                            {isSigningUp ? (
                              <>
                                <Loader2 className="w-5 h-2  animate-spin  " /> Loading...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                        </form>
               
                        {/* Footer */}
                    <div className="mt-6 text-center">
                     <p className="text-sm text-gray-500 inline">
                         Already have an account?{" "}
                      <Link to="/Login" className="text-blue-600 hover:underline inline">
                        Sig in
                        </Link>
                     </p>
                     </div>
             </div>   
        </div>
         {/* Right Side Pattern */}
              <AuthImagePattern
                title={"Join Your Community !"}
                Subtitle={
                  "Connect with  Friends and  Family ,  Share your throughts  And Stay in touch with your loved ones"
                }
              />
      </div>
    </>
  )
}

export default Register
