import Navbar from './components/Navbar.jsx';
import Home from '../src/screens/HomeScreen';
import SignUp from '../src//screens/auth/SignUpScreen';
import Login from '../src//screens/auth/LoginScreen';

import Footer from './components/Footer';

import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/auth/useAuthFunction.jsx';

import { Loader } from "lucide-react";

function App() {
  const { user, verifyAuth, isVerifyingAuth } = useAuthStore();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  if (isVerifyingAuth && !user)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="p-5 flex-grow overflow-y-auto min-h-screen">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
