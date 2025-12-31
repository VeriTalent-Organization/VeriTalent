interface NotificationsTabProps {
  notifications: {
    email: boolean;
    newApplications: boolean;
    interviewReminders: boolean;
    systemUpdates: boolean;
  };
  onToggle: (key: keyof NotificationsTabProps['notifications']) => void;
}

interface NotificationOption {
  key: keyof NotificationsTabProps['notifications'];
  title: string;
  description: string;
}

export const NotificationsTab = ({ notifications, onToggle }: NotificationsTabProps) => {
  const options: NotificationOption[] = [
    {
      key: 'email',
      title: 'Email Notifications',
      description: 'Receive email updates about your account activity'
    },
    {
      key: 'newApplications',
      title: 'New Applications',
      description: 'Get notified when new applications are received'
    },
    {
      key: 'interviewReminders',
      title: 'Interview Reminders',
      description: 'Receive reminders about upcoming interviews'
    },
    {
      key: 'systemUpdates',
      title: 'System Updates',
      description: 'Get notified about system maintenance and updates'
    }
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
        Notification Preferences
      </h2>
      
      <div className="space-y-4 sm:space-y-6">
        {options.map((option) => (
          <div 
            key={option.key}
            className="flex items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                {option.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {option.description}
              </p>
            </div>
            <button
              onClick={() => onToggle(option.key)}
              className={`relative w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-colors shrink-0 ${
                notifications[option.key as keyof typeof notifications] 
                  ? 'bg-teal-600' 
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  notifications[option.key as keyof typeof notifications] 
                    ? 'translate-x-5 sm:translate-x-6' 
                    : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};