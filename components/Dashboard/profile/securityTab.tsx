import FormComponent from '@/components/forms/form';

export const SecurityTab = () => {
  const passwordFields = [
    {
      name: 'currentPassword',
      label: 'Current Password',
      placeholder: 'Enter your current password',
      type: 'password',
      colSpan: 12
    },
    {
      name: 'newPassword',
      label: 'New Password',
      placeholder: 'Enter your new password',
      type: 'password',
      colSpan: 12
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      placeholder: 'Confirm your new password',
      type: 'password',
      colSpan: 12
    }
  ];

  const handlePasswordUpdate = (data: Record<string, string>) => {
    console.log('Password update data:', data);
    // Add your password update logic here
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
        Security Settings
      </h2>
      
      {/* Change Password Section */}
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Change Password
        </h3>
        
        <div className="max-w-full sm:max-w-xl">
          <FormComponent
            fields={passwordFields}
            submitButtonText="Update Password"
            submitButtonStyle="bg-brand-primary hover:bg-cyan-700"
            submitButtonPosition="left"
            submitFunction={handlePasswordUpdate}
          />
        </div>
      </div>

      {/* Login Sessions Section */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Login Sessions
        </h3>
        
        <div className="space-y-3 sm:space-y-4">
          {/* MacBook Pro Session */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                MacBook Pro
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                New York, US • Current session
              </p>
            </div>
          </div>

          {/* iPhone Session */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                iPhone 13
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Last active 2 hours ago
              </p>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base self-start sm:self-auto">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};