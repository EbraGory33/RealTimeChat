import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthFunction';


export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { signup } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    console.log(`Signup: ${email}, ${username}`);
    signup({ email, username, password });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="App Logo" className="h-12 mx-auto" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500">Get started with your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              placeholder="yourusername"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 rounded-md transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}