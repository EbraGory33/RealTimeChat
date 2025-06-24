
{/*// todo edit function------------------------------------------------------------------------------------------------------------
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
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await MessageHistory(userId);
      console.log(`res =`,res)
      set({ messages: res.data });
      console.log(`(getMessages) Messages:`, get().messages);
    } catch (error) {
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    }
  },

  addNewContact: (newUser) => {
    const currentContacts = get().users;
    const exists = currentContacts.some(user => user._id === newUser._id);
    console.log(`Before {addNewContact} ->${get().users}`)
    if (!exists) {
      set({ users: [...currentContacts, newUser] });
    }
    console.log(`After {addNewContact} ->${get().users}`)
  },


  // Todo: (Un)Subcribe Functions ----------------------------------------------------

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    
    console.log("(subscribeToMessages) method selectedUser =", selectedUser)

    const socket = useAuthStore.getState().socket;
    
    console.log("(subscribeToMessages) method socket =", socket)

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
    try {
      if (typeof term !== "string") return;

      const socket = useAuthStore.getState().socket;
      
      socket.emit("searchUsers", term); 
      socket.off("searchUsers")
      socket.off("searchResults");
      
      socket.on("searchResults", (users) => {
      set({ searchUsers: users }); // no spreading; server sends complete list
      }); 
    }catch (err) {
      console.error("Error searching users:", err.message);
    }
  }

}));
//------------------------------------------------------------------------------------------------------------------------------*/}








{/*import { create } from "zustand"
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "../chat/useChatFunction";

import { CheckAuth, LoginUser, CreateUser, LogoutUser } from "../../lib/endpoints/auth"

export const useAuthStore = create((set, get) => ({
    user: null,
    onlineUsers: [],
    isSigningUp: false,
    isLoggingIn: false,
    isVerifyingAuth: true,
    socket: null,

    verifyAuth: async () => {
        try {
            const res = await CheckAuth();

            set({ user: res.data });
            get().connectSocket();
            console.log(get().socket)

        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ user: null });
        } finally {
            set({ isVerifyingAuth: false });
        }
    },

    signup: async ({email, username, password}) => {
        try{
            const res = await CreateUser(email, username, password)
            set({ user: res.data });
            toast.success("Account created successfully");
            // Todo : Socket-----
            get().connectSocket();
            console.log(get().socket)
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async ({username, password}) => {
        try{
            const res = await LoginUser(username, password)
            set({ user: res.data });
            toast.success("Logged in successfully");
            // Todo : Socket-----
            get().connectSocket();
            console.log(get().socket)

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    logout: async () => {
        try{
            await LogoutUser()
            set({user : null});
            toast.success("Logged out successfully")
            // Todo : Socket-----
            get().disconnectSocket();
            console.log(get().socket)

        } catch(error) {
            toast.error(error.response.data.message);
        }
    },
    connectSocket: () => {
        const { user } = get();

        if (!user || get().socket?.connected) return;
        const socket = io('http://localhost:8000', {
        query: {
            userId: user._id,
        },
        });
        
        socket.connect();

        
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
        });
        
        socket.on("newContact", ({ contact }) => {
          useChatStore.getState().addNewContact(contact);
        });

    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));*/}
