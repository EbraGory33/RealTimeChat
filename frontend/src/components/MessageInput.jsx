import { useState } from "react";
import { useChatStore } from "../store/chat/useChatFunction";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChatStore();

  // Handler for sending the message
  const submitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      await sendMessage(trimmedMessage);

      // Reset input field after sending
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={submitMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="btn btn-sm btn-circle"
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

