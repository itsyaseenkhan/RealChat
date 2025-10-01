import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import DefaultImage from "../assets/images.png";
import { Camera, Loader2, Mail, User } from "lucide-react";
import { updateProfile } from "../Store/slices/authSlice.js";

const Profile = () => {
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    FullName: authUser?.FullName || "",
    Email: authUser?.Email || "",
    Avatar: authUser?.Avatar?.url || "",
  });

  const dispatch = useDispatch();

  // handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image); // preview ke liye
      setFormData({ ...formData, Avatar: file }); // file ko formData me daalna
    };
  };

  // handle profile update
  const handleupdateProfile = () => {
    const data = new FormData();
    data.append("FullName", formData.FullName);
    data.append("Email", formData.Email);

    // Avatar ko sahi tarah bhejna
    if (formData.Avatar instanceof File) {
      data.append("Avatar", formData.Avatar); // file bhejega
    }

    dispatch(updateProfile(data));
  };

  return (
    <div className='min-h-screen pt-20 bg-gray-50'>
      <div className='max-w-2xl mx-auto p-6 py-8'>
        <div className='bg-white rounded-xl shadow-md p-6 space-y-8'>
          <div className='text-center '>
            <h1 className='text-2xl font-bold text-gray-800'>Profile Update</h1>
            <p className='mt-2 text-gray-500'>Your Profile Information</p>

            {/* Avatar */}
            <div className='flex flex-col items-center gap-4 '>
              <div className='relative'>
                <img
                  src={selectedImage || (formData.Avatar instanceof File ? selectedImage : formData.Avatar) || DefaultImage}
                  alt="Profile"
                  className='w-32 h-32 rounded-full object-cover object-top border-4 border-gray-200'
                />
                <label
                  htmlFor="Avatar-upload"
                  className={`absolute bottom-0 right-0 bg-gray-800 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className='w-6 h-6 text-white' />
                  <input
                    type="file"
                    id='Avatar-upload'
                    className='hidden'
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className='text-sm text-gray-500'>
                {isUpdatingProfile ? "Uploading........" : "Click the camera icon to upload your Image."}
              </p>
            </div>

            {/* user info */}
            <div className='space-y-6 mt-6'>
              <div className='space-y-1.5'>
                <div className='text-sm text-gray-500 flex items-center gap-2'>
                  <User className="w-4 h-4" /> Full Name
                </div>
                <input
                  type="text"
                  value={formData.FullName}
                  onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                  className='px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 w-full focus:outline-none'
                />
              </div>
            </div>

            <div className='space-y-6 mt-6'>
              <div className='space-y-1.5'>
                <div className='text-sm text-gray-500 flex items-center gap-2'>
                  <Mail className="w-4 h-4" /> Email
                </div>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className='px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 w-full focus:outline-none'
                />
              </div>
            </div>

            {/* update Profile button */}
            <button
              onClick={handleupdateProfile}
              disabled={isUpdatingProfile}
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex items-center justify-center gap-2 mt-6'
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> Loading...
                </>
              ) : (
                "Update Profile"
              )}
            </button>

            {/* Account INFO */}
            <div className='mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm text-gray-600'>
                <div className='flex items-center py-2 border-b justify-between border-gray-200'>
                  <span>Member Since</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className='flex items-center py-2 border-b justify-between border-gray-200'>
                  <span>Account Status</span>
                  <span className='text-green-600 font-medium'>Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
