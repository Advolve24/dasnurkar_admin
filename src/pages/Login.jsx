import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    localStorage.setItem("isAuthenticated", "true");
    navigate("/projects");
  } else {
    setError("Invalid credentials");
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9f5] via-[#f2e5dc] to-[#f9f6f2] flex items-center justify-center overflow-hidden px-4"  style={{ fontFamily: 'Montserrat' }}>
      {/* Glowing circle background */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Card container with slide-up animation */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center text-[#2f2f2f] mb-6 tracking-wide drop-shadow">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b4b3e] focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b4b3e] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8e7050] to-[#2f2f2f] hover:from-[#2f2f2f] hover:to-[#000] text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
