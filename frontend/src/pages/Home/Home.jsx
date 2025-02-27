import "../../index.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to <span className="text-indigo-600">PhotoBook</span>
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Connect with photographers and book sessions
        </p>
        <div className="flex space-x-4">
          <a
            href="/register"
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
