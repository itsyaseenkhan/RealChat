import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from '../Store/slices/chatSlice';
import { getSocket } from "../lib/socket.js";
import MessageInput from "./MessagesInput";
import MessageSkeleton from "./Skeleton/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import DefualtAvatar from "../assets/images.png";
import {Trash} from "lucide-react";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(state => state.chat);
  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const messageEndRef = useRef();

  useEffect(() => {
    if (!selectedUser?._id) return;
    dispatch(getMessages(selectedUser._id));

    const socket = getSocket();
    if (!socket) return;
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (isMessagesLoading) {
    return (
      <div className='flex flex-1 flex-col overflow-auto'>
        <ChatHeader /> <MessageSkeleton /> <MessageInput />
      </div>
    );
  }



  return (
    <div className='flex flex-1 flex-col overflow-hidden bg-white'>
      <ChatHeader />

      <div className='flex flex-1 flex-col-reverse overflow-y-auto p-4 space-y-6 space-y-reverse'>
        {messages?.length > 0 &&
          [...messages].reverse().map((message, index) => {
            const senderId = message.sender?._id || message.sender || message.SenderID;
            const isSender = String(senderId) === String(authUser._id);

            return (
              <div
                key={message._id || index}
                className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
                ref={index === 0 ? messageEndRef : null} 
              >
                {/* avatar */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border shrink-0 ${
                    isSender ? "order-2 ml-3" : "order-1 mr-3"
                  }`}
                >
                  <img
                    src={
                      isSender
                        ? authUser?.Avatar?.url || DefualtAvatar
                        : selectedUser?.Avatar?.url || DefualtAvatar
                    }
                    alt="avatar"
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* bubble */}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 rounded-2xl text-sm flex flex-col gap-2
                    ${isSender
                      ? "bg-green-200 text-black order-1 rounded-tr-none"
                      : "bg-white text-black order-2 shadow rounded-tl-none"
                    }`}
                >
                  {/* image/video */}
                  {message.media && (
                    <div className="relative">
                      {/\.(mp4|webm|mov)$/i.test(message.media) ? (
                        <video
                          src={message.media}
                          controls
                          className="max-w-[220px] rounded-xl"
                        />
                      ) : (
                        <img
                          src={message.media}
                          alt="Attachment"
                          className="max-w-[220px] rounded-xl"
                        />
                      )}
                    </div>
                  )}

                  {/* text */}
                  {message.text && <p>{message.text}</p>}

                  {/* time */}
                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
