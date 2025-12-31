import { useCreateUserStore } from "@/lib/stores/form_submission_store";

interface FormField {
  label: string;
  defaultValue: string;
  type: string;
}

export const PersonalInfoTab = () => {
  const { user } = useCreateUserStore();

  const fields: FormField[] = [
    { label: 'First Name', defaultValue: user.full_name?.split(' ')[0] || '', type: 'text' },
    { label: 'Last Name', defaultValue: user.full_name?.split(' ').slice(1).join(' ') || '', type: 'text' },
    { label: 'Email', defaultValue: user.email || '', type: 'email' },
    { label: 'Phone', defaultValue: (user as any).phone || '', type: 'tel' },
    { label: 'Job Title', defaultValue: user.current_designation || '', type: 'text' },
    { label: 'Department', defaultValue: user.professional_status || '', type: 'text' }
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
        Personal Information
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              defaultValue={field.defaultValue}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
            />
          </div>
        ))}
      </div>
    </div>
  );
};