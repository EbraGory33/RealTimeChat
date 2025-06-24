import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chat/useChatFunction";
import { useAuthStore } from "../store/auth/useAuthFunction";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import LoadingChatSkeleton from "./skeleton/LoadingChatSkeleton";
import MessageBubble from "./MessageContainer";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { user } = useAuthStore();

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (endOfMessagesRef.current && messages?.length) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <LoadingChatSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <section className="flex flex-col flex-grow overflow-auto">
      <ChatHeader />

      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isFromCurrentUser = msg.sender === user._id;
          const senderInitial = isFromCurrentUser
            ? user.username?.charAt(0).toUpperCase()
            : selectedUser.username?.charAt(0).toUpperCase();

          return (
            <div
              key={msg._id}
              ref={endOfMessagesRef}
              className={`flex items-end space-x-3 ${
                isFromCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isFromCurrentUser && (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border bg-gray-400 flex items-center justify-center font-bold text-black uppercase">
                    {senderInitial}
                  </div>
                  <span className="text-xs opacity-70 mt-1">{selectedUser.username}</span>
                </div>
              )}

              <MessageBubble
                message={msg.content}
                isCurrentUser={isFromCurrentUser}
                time={formatMessageTime(msg.createdAt)}
              />

              {isFromCurrentUser && (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border bg-gray-400 flex items-center justify-center font-bold text-black uppercase">
                    {senderInitial}
                  </div>
                  <span className="text-xs opacity-70 mt-1">{user.username}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </section>
  );
};

export default ChatContainer;
