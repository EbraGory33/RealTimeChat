import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "../chat/useChatFunction";
import { CheckAuth, LoginUser, CreateUser, LogoutUser } from "../../lib/endpoints/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  socket: null,
  onlineUsers: [],
  isVerifyingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  // Check if user is authenticated and initialize socket
  verifyAuth: async () => {
    try {
      const response = await CheckAuth();
      set({ user: response.data });
      get().initializeSocket();
    } catch (err) {
      console.error("Auth verification failed:", err);
      set({ user: null });
    } finally {
      set({ isVerifyingAuth: false });
    }
  },

  // Register new user and connect socket
  signup: async ({ email, username, password }) => {
    set({ isSigningUp: true });
    try {
      const response = await CreateUser(email, username, password);
      set({ user: response.data });
      toast.success("Account successfully created.");
      get().initializeSocket();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login user and connect socket
  login: async ({ username, password }) => {
    set({ isLoggingIn: true });
    try {
      const response = await LoginUser(username, password);
      set({ user: response.data });      
      toast.success("Logged in successfully.");
      get().initializeSocket();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout and disconnect socket
  logout: async () => {
    try {
      await LogoutUser();
      set({ user: null });
      toast.success("You have been logged out.");
      get().disconnectSocket();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed.");
    }
  },

  // Set up socket connection and listeners
  initializeSocket: () => {
    const { user, socket } = get();
    if (!user || socket?.connected) return;

    const newSocket = io(process.env.REACT_APP_API_BASE_URL, {
      query: { userId: user._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("newContact", ({ contact }) => {
      useChatStore.getState().addNewContact(contact);
    });
  },

  // Gracefully disconnect the socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },
}));
