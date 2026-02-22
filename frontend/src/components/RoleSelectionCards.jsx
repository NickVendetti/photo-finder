import { Users, Camera, ArrowLeft } from "lucide-react";

function RoleSelectionCards({ onSelect, onBack, isLoading }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        What brings you here?
      </h3>
      <p className="text-sm text-gray-500 mb-8">Choose how you'll use PhotoBook</p>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          data-testid="role-user-card"
          onClick={() => onSelect("USER")}
          disabled={isLoading}
          className="flex-1 flex flex-col items-center gap-4 p-8 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-4 bg-indigo-50 rounded-full">
            <Users className="h-10 w-10 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">I'm looking to hire</p>
            <p className="text-sm text-gray-500 mt-1">
              Browse photographers and book sessions
            </p>
          </div>
        </button>

        <button
          data-testid="role-photographer-card"
          onClick={() => onSelect("PHOTOGRAPHER")}
          disabled={isLoading}
          className="flex-1 flex flex-col items-center gap-4 p-8 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-4 bg-indigo-50 rounded-full">
            <Camera className="h-10 w-10 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">I'm a photographer</p>
            <p className="text-sm text-gray-500 mt-1">
              Showcase your work and manage bookings
            </p>
          </div>
        </button>
      </div>

      {isLoading && (
        <p className="mt-6 text-sm text-indigo-600 animate-pulse">
          Creating your account...
        </p>
      )}

      <button
        data-testid="role-back-button"
        onClick={onBack}
        disabled={isLoading}
        className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-4 w-4" />
        Go back
      </button>
    </div>
  );
}

export default RoleSelectionCards;
