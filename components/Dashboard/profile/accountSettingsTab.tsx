export const AccountSettingsTab = () => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
        Account Settings
      </h2>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Account Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Account Status
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Your account is active and verified
            </p>
          </div>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm sm:text-base self-start sm:self-auto">
            Active
          </span>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-primary hover:bg-cyan-700 text-white rounded-lg font-medium text-sm sm:text-base">
            Enable
          </button>
        </div>

        {/* Data Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Data Export
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Download a copy of your account data
            </p>
          </div>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm sm:text-base">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};