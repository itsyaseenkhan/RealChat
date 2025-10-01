import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser, getUsers } from "../Store/slices/chatSlice";
import { User } from "lucide-react";
import SidebarSkeleton from "./Skeleton/SidebarSkeleton";
import DefualtAvatar from "../assets/images.png";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { onlineUsers, authUser } = useSelector((state) => state.auth);
  const { users, selectedUser, isUserLoading } = useSelector(
    (state) => state.chat
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => onlineUsers.includes(user._id))
    : users;

      const onlineCount = authUser ? onlineUsers?.filter((id) => 
       id !== authUser._id).length : onlineUsers?.length ||  0;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
      <div className="border-b border-gray-200 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-700" />
          <span className="font-medium hidden lg:block text-gray-800">
            Contacts
          </span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <button
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showOnlineOnly ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showOnlineOnly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">Show Online Only</span>
          <span className="text-xs text-gray-500">
            ({onlineCount} online)</span>
        </div>
      </div>

      <div className="overflow-auto w-full py-3">
        {filteredUsers?.length > 0 &&
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`w-full flex p-3 items-center gap-3 transition-colors rounded-md ${
                selectedUser?._id === user._id
                  ? "bg-gray-200 ring-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user?.Avatar?.url || DefualtAvatar}
                  alt="user avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {user.FullName}
                  {authUser?._id === user._id && " (You)"} 
                </div>
                <div className="text-sm text-gray-500">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

        {filteredUsers?.length === 0 && (
          <div className="text-center text-gray-500 py-4">No Users Found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
