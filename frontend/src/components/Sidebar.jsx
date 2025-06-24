import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth/useAuthFunction";
import { useChatStore } from "../store/chat/useChatFunction";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    searchUsers,
    searchUsersByTerm,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (searchInput.trim()) {
      searchUsersByTerm(searchInput);
    }
  }, [searchInput, searchUsersByTerm]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex flex-col w-64 h-full border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        {/* Search Box */}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search contacts..."
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Results */}
        {searchInput.trim() && searchUsers.length > 0 && (
          <ul className="mt-2 max-h-56 overflow-y-auto rounded-md border bg-white shadow">
            {searchUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchInput("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span className="text-lg font-semibold">Contacts</span>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 ${
              selectedUser?._id === user._id ? "bg-gray-100 ring-1 ring-gray-300" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-black uppercase">
                {user.username?.[0]}
              </div>
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
              )}
            </div>

            <div className="text-left">
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-500">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
