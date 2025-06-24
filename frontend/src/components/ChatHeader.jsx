
import { X } from "lucide-react";
import { useAuthStore } from "../store/auth/useAuthFunction";
import { useChatStore } from "../store/chat/useChatFunction";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Check if selected user is currently online
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <header className="border-b border-gray-300 p-3">
      <div className="flex justify-between items-center">
        <section className="flex items-center space-x-4">
          {/* User avatar with initial fallback */}
          <div className="relative w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold uppercase">
            {selectedUser?.username?.[0] || "?"}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* User name and online status */}
          <div className="text-left">
            <h2 className="text-gray-800 font-semibold">{selectedUser?.username || "Unknown User"}</h2>
            <p className={`text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </section>

        {/* Button to deselect user and close chat */}
        <button
          aria-label="Close chat"
          onClick={() => setSelectedUser(null)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
