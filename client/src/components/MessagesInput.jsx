// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../lib/socket";
// import { Image, Send, X } from "lucide-react";
// import { sendMessage } from '../Store/slices/chatSlice';
// import { toast } from "react-toastify";

// const MessagesInput = () => {
//   const [text, setText] = useState("");
//   const [mediaPreview, setMediaPreview] = useState(null);
//   const [media, setMedia] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();
//   const { selectedUser } = useSelector(state => state.chat);

//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setMedia(file);
//     const type = file.type;

//     if (type.startsWith("image/")) {
//       setMediaType("image");
//       const reader = new FileReader();
//       reader.onload = () => {
//         setMediaPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else if (type.startsWith("video/")) {
//       setMediaType("video");
//       const videoUrl = URL.createObjectURL(file);
//       setMediaPreview(videoUrl);
//     } else {
//       toast.error("Please select an image or video file.");
//       setMedia(null);
//       setMediaPreview(null);
//       setMediaType(null);
//     }
//   };

//   const removeMedia = () => {
//     setMedia(null);
//     setMediaPreview(null);
//     setMediaType(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     if (!text.trim() && !media) return;

//     const data = new FormData();
//     data.append("text", text.trim());
//     if (media) data.append("media", media);

//     dispatch(sendMessage(data));

//     // reset all
//     setMedia(null);
//     setText("");
//     setMediaPreview(null);
//     setMediaType(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket || !selectedUser?._id) return;

//     const handleNewMessage = (newMessage) => {
//       if (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id) {
//         dispatch({ type: "chat/pushNewMessage", payload: newMessage });
//       }
//     };

//     socket.on("newMessage", handleNewMessage);
//     return () => socket.off("newMessage", handleNewMessage);
//   }, [selectedUser?._id, dispatch]);

//   return (
//     <div className='p-4 w-full'>
//       {mediaPreview && (
//         <div className='mb-3 flex items-center gap-2'>
//           <div className='relative'>
//             {mediaType === "image" ? (
//               <img src={mediaPreview}  alt="Preview"
//                 className='w-32 h-20 object-cover rounded-lg border border-gray-200'
//               />
//             ) : (
//               <video
//                 src={mediaPreview}  className='w-32 h-20 object-cover rounded-lg border border-gray-700'
//                 controls
//               />
//             )}
//             <button
//               onClick={removeMedia} type='button'className='absolute -top-2 right-2 w-5 h-5 bg-zinc-800 text-white 
//               rounded-full flex items-center justify-center hover:bg-black'
//             >
//               <X className='w-3 h-3' />
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
//         <div className='flex-1 flex gap-2'>
//           <input
//             type="text" value={text}onChange={(e) => setText(e.target.value)}placeholder='Type a message...' className='w-full px-4 py-2 
//              rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
//           />
//           {/* Hidden file input */}
//            <input type="file"accept='image/*,video/*' ref={fileInputRef}className='hidden' onChange={handleMediaChange}/>
//             <button type='button'onClick={() => fileInputRef.current?.click()}className={`flex items-center justify-center w-10 h-10 rounded-full 
//             border border-gray-300 hover:border-gray-400 transition ${mediaPreview ? "text-emerald-500" : "text-gray-400"}`}>
//             <Image size={20} />
//             </button>
//            </div>
//         <button
//           type='submit'
//           className='w-10 h-10 flex items-center justify-center rounded-full 
//           bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50'
//           disabled={!text.trim() && !media}
//         >
//           <Send />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MessagesInput;
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../lib/socket";
import { Image, Send, X, Mic, Square } from "lucide-react"; 
import { sendMessage } from "../Store/slices/chatSlice";
import { toast } from "react-toastify";

const MessagesInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voiceMessage.webm", {
          type: "audio/webm",
        });

        setMedia(audioFile);
        setMediaType("audio");
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      toast.error("Microphone access denied.");
    }
  };

  // ⏹ Stop recording
  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    const type = file.type;

    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      setMediaPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select an image or video file.");
      setMedia(null);
      setMediaPreview(null);
      setMediaType(null);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
    setAudioUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media && !audioUrl) return;

    const data = new FormData();
    data.append("text", text.trim());
    if (media) data.append("media", media);
    if (mediaType === "audio" && audioUrl) {
      data.append("duration", 10); // TODO: calculate actual duration
    }

    dispatch(sendMessage(data));

    // reset all
    setMedia(null);
    setText("");
    setMediaPreview(null);
    setMediaType(null);
    setAudioUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.sender === selectedUser._id ||
        newMessage.receiver === selectedUser._id
      ) {
        dispatch({ type: "chat/pushNewMessage", payload: newMessage });
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedUser?._id, dispatch]);

  return (
    <div className="p-4 w-full">
      {/* Media / Audio preview */}
      {(mediaPreview || audioUrl) && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-32 h-20 object-cover rounded-lg border border-gray-200"
              />
            ) : mediaType === "video" ? (
              <video
                src={mediaPreview}
                className="w-32 h-20 object-cover rounded-lg border border-gray-700"
                controls
              />
            ) : (
              <audio
                src={audioUrl}
                controls
                className="w-[200px] h-[36px] rounded-lg border border-gray-300 bg-gray-100"
              />
            )}
            <button
              onClick={removeMedia}
              type="button"
              className="absolute -top-2 right-2 w-5 h-5 bg-zinc-800 text-white 
              rounded-full flex items-center justify-center hover:bg-black"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 
             rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleMediaChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center justify-center w-10 h-10 rounded-full 
            border border-gray-300 hover:border-gray-400 transition ${
              mediaPreview ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            <Image size={20} />
          </button>
        </div>

        {/* 🎤 Mic Button */}
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-red-600 text-white hover:bg-red-700 transition"
          >
            <Square />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            <Mic />
          </button>
        )}

        {/* 📨 Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !media && !audioUrl}
          className="w-10 h-10 flex items-center justify-center rounded-full 
          bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Send />
        </button>
      </form>
    </div>
  );
};

export default MessagesInput;
