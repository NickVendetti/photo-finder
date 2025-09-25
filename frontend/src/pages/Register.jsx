import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/client";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "USER",
  });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasNumber || !hasSpecialChar) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least 1 number and 1 special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for PhotoBook
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
              data-testid="error-message"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegisterSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  data-testid="username-input"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  data-testid="email-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                  data-testid="password-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="user_type"
                className="block text-sm font-medium text-gray-700"
              >
                User Type
              </label>
              <div className="mt-1">
                <select
                  id="user_type"
                  name="user_type"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  data-testid="user-type-select"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="USER">User</option>
                  <option value="PHOTOGRAPHER">Photographer</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                data-testid="register-button"
                disabled={isLoading || !!passwordError}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                data-testid="login-link"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
