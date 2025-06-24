import { useChatStore } from "../store/chat/useChatFunction";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <section className="h-screen bg-base-200">
      <div className="flex justify-center items-center pt-20 px-4">
        <div className="w-full max-w-6xl h-[calc(100vh-8rem)] bg-base-100 rounded-xl shadow-cl">
          <div className="flex h-full overflow-hidden rounded-xl">
            <Sidebar />

            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;