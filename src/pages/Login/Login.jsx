import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import logo from "../../../public/logo.jpg";


import { login } from "../../store/slices/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // Redirect to upload-questions if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/upload-questions");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await dispatch(login({ username, password })).unwrap();
            navigate("/upload-questions");
        } catch (err) {
            setError(err.message || "Username Or Password Is Incorrect");
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111]  to-[#1a1a1a]">
        <div className="bg-[#111] backdrop-blur-md p-8 rounded-xl shadow-2xl w-[500px] transition-all duration-300 border border-[#2a2a2a] px-10">
          <div className="flex flex-col items-center mb-4">
            
            <img src={logo} alt="Logo" className="w-16 h-16 mb-4 rounded-lg"  />
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">
              Mock Test App
            </h1>
            <p className="text-gray-300 mt-2">Login to your Quiz App account</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 animate-shake">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-gray-300 font-semibold mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#222] pl-10 pr-4 py-3 border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                  required
                  placeholder="Enter your username"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-300 font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#222] pl-10 pr-4 py-3 border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                  required
                  placeholder="Enter your password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            > 
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/"
                className="text-green-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
              >
                Sign up
              </a>
            </p>
            <a
              href="/"
              className="text-red-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    );
}

export default Login;
