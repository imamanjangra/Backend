import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/todos");
  }, [user, navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const { data } = await API.post("/users/login", {
      email,
      password,
    });

    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    navigate("/todos");
  } catch (err) {
    setError("Invalid email or password");
  }
};


  return (
    <form onSubmit={handleLogin}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Email"
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Password"
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>

          <p className="text-sm mt-3 text-center">
            No account?{" "}
            <Link to="/signup" className="text-blue-500">Signup</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Login;
