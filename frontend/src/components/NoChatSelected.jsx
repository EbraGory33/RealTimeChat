const NoChatSelected = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center p-16 bg-base-100/40 w-full">
      <div className="max-w-lg text-center space-y-8">
        {/* Logo container with bounce animation */}
        <div className="flex justify-center mb-6">
          <div className="rounded-xl bg-primary/20 w-20 h-20 flex items-center justify-center animate-pulse relative">
            <img
              src="/logo.jpeg"
              alt="App Logo"
              className="w-10 h-10"
            />
          </div>
        </div>

        {/* Greeting */}
        <h2 className="text-2xl font-bold">Welcome to GrapeVine chat app!</h2>
      </div>
    </section>
  );
};

export default NoChatSelected;
