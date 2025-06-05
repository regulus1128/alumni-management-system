import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMessages,
  getUserConversations,
  sendMessage,
  setSelectedConversation,
} from "../features/chatSlice";
import { useSearchParams } from "react-router-dom";


const ProfileChats = () => {
  const { conversations, selectedConversation, messages } = useSelector(
    (state) => state.chat
  );
  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const { user } = useSelector((state) => state.profile);

  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiver");

  const selectedUser = selectedConversation?.members?.find(
    (m) => m.user._id !== user._id
  )?.user;

  // console.log(selectedUser);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    dispatch(
      sendMessage({
        conversationId: selectedConversation?._id,
        content: messageInput,
      })
    );
    setMessageInput("");
  };

  useEffect(() => {
    dispatch(getUserConversations());
  }, [dispatch]);

  useEffect(() => {
    let interval = null;
    if (selectedConversation?._id) {
      interval = setInterval(() => {
        dispatch(getMessages(selectedConversation._id));
      }, 5000); // every 5 seconds
    }
    return () => clearInterval(interval);
  }, [selectedConversation, dispatch]);

  useEffect(() => {
    if (conversations.length > 0) {
      let convo = null;
      if (id) {
        convo = conversations.find((c) =>
          c.members.some((m) => m.user._id === id)
        );
      } else {
        convo = conversations[0]; // fallback to first convo
      }
  
      if (convo) {
        dispatch(setSelectedConversation(convo));
        dispatch(getMessages(convo._id));
      }
    }
  }, [id, conversations]);

  return (
    <div className={`w-full h-[85vh] flex transition-colors duration-300 ${
      mode ? "bg-[#121212] text-white" : "bg-gray-100 text-gray-800"
    } shadow rounded-md overflow-hidden`}>
    
      {/* Sidebar */}
      <div className={`w-1/4 overflow-y-auto border-r ${
        mode ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className={`p-4 text-xl font-semibold border-b mt-3 ${
          mode ? "text-white border-gray-700" : "text-gray-700 border-gray-200"
        }`}>
          Conversations
        </div>
        {conversations.map((c) => {
          const otherMember = c.members.find((m) => m.user._id !== user._id)?.user;
          return (
            <div
              key={c._id}
              onClick={() => {
                dispatch(setSelectedConversation(c));
                dispatch(getMessages(c._id));
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                selectedConversation?._id === c._id
                  ? mode ? "bg-gray-800" : "bg-gray-100"
                  : ""
              } hover:${mode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <img
                src={otherMember.avatar}
                className="w-10 h-10 rounded-full"
              />
              <span className={`${mode ? "text-white" : "text-gray-800"} font-medium`}>
                {otherMember.name}
              </span>
            </div>
          );
        })}
      </div>
    
      {/* Chat Box */}
      <div className="w-3/4 flex flex-col justify-between">
        {/* Chat Header */}
        <div className={`px-6 py-4 border-b flex items-center gap-3 ${
          mode ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"
        }`}>
          <img
            src={selectedUser?.avatar}
            alt={selectedUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-lg">{selectedUser?.name}</span>
        </div>
    
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto px-6 py-4 space-y-4 ${
          mode ? "bg-[#181818]" : "bg-[#f8f8f8]"
        }`}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender?.user?._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[60%] rounded-lg text-sm shadow ${
                  msg.sender?.user?._id === user._id
                    ? "bg-teal-500 text-white rounded-br-none"
                    : mode
                    ? "bg-[#2a2a2a] text-white rounded-bl-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[11px] mt-1 text-right opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
    
        {/* Input Box */}
        <div className={`border-t px-4 py-3 flex items-center gap-2 ${
          mode ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"
        }`}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className={`flex-1 border rounded-sm px-3 py-2 text-sm outline-none ${
              mode
                ? "bg-[#2a2a2a] text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default ProfileChats;
