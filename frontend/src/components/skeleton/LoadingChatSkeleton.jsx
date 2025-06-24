const LoadingChatSkeleton = () => {
  // Generate an array with 6 placeholders to represent skeleton messages
  const placeholders = new Array(6).fill(undefined);

  return (
    <section className="flex-grow overflow-y-auto p-4 space-y-4">
      {placeholders.map((_, index) => (
        <article 
          key={index} 
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <figure className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </figure>

          <header className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </header>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </article>
      ))}
    </section>
  );
};

export default LoadingChatSkeleton;

