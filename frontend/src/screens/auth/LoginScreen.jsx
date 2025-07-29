import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth/useAuthFunction';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Logging in with: ${username}`);
    try{
      await login({ username, password });
    }catch(error){
      console.error(`Login Error: ${error}`)
    }
  };

  return (
    <section className="flex flex-col min-h-screen items-center justify-center px-6 py-10 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/logo.jpeg"
            alt="App Logo"
            className="mx-auto h-12 w-auto"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow p-6 space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition-colors text-sm font-medium"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}