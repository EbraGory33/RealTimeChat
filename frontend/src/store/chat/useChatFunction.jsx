import { create } from "zustand";
import toast from "react-hot-toast";

import { GetContacts, MessageHistory, Send_Message } from "../../lib/endpoints/chat";
import { useAuthStore } from "../auth/useAuthFunction";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  searchUsers: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await GetContacts();
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await MessageHistory(userId);
      //console.log("Fetched messages:", res);
      set({ messages: res.data });
      //console.log("Current messages state:", get().messages);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await Send_Message(selectedUser._id, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Message failed to send.");
    }
  },

  addNewContact: (newUser) => {
    const currentContacts = get().users;
    const exists = currentContacts.some(user => user._id === newUser._id);
    console.log("Contacts before adding:", currentContacts);
    if (!exists) {
      set({ users: [...currentContacts, newUser] });
    }
    console.log("Contacts after adding:", get().users);
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    //console.log("Subscribing to messages from:", selectedUser);
    //console.log("Socket instance:", socket);

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.sender === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  searchUsersByTerm: (term) => {
    if (typeof term !== "string") return;

    const socket = useAuthStore.getState().socket;

    try {
      socket.emit("searchUsers", term);

      socket.off("searchUsers");
      socket.off("searchResults");

      socket.on("searchResults", (users) => {
        set({ searchUsers: users });
      });
    } catch (err) {
      console.error("Search error:", err.message);
    }
  },
}));
