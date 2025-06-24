
const MessageBubble = ({ message, isCurrentUser, time }) => (
  <div className="flex flex-col items-start w-fit max-w-[33%] sm:max-w-[33%] xs:max-w-[80%]">
    <div
      className={`inline-block rounded-2xl px-4 py-2 text-sm ${
        isCurrentUser
          ? "bg-blue-600 text-white rounded-br-none self-end"
          : "bg-blue-800 text-white rounded-bl-none self-start"
      }`}
    >
      {message}
    </div>
    <time
      className={`text-[10px] opacity-70 mt-1 ${
        isCurrentUser ? "self-end" : "self-start"
      }`}
    >
      {time}
    </time>
  </div>
);

export default MessageBubble;
