import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-primary-100 to-primary-200 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-primary-800 mb-8">
          Welcome to <span className="text-secondary-600">PhotoBook</span>
        </h1>
        <p className="text-2xl text-neutral-700 mb-12">
          Connect with photographers and book sessions
        </p>
        <div className="flex justify-center space-x-4">
          {!isAuthenticated ? (
            <Link to="/register" className="btn btn-primary text-lg">
              Sign Up
            </Link>
          ) : (
            <Link to="/discover" className="btn btn-primary text-lg">
              Discover Photographers
            </Link>
          )}
          </div>
      </main>
    </div>
  );
}
