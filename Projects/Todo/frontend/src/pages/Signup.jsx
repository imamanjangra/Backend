import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/todos");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await API.post("/users/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/todos");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Signup
          </button>

          <p className="text-sm mt-3 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Signup;
