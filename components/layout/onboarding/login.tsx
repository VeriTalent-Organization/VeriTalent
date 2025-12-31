"use client";

import { useState } from "react";
import FormComponent from "@/components/forms/form";
import { useRouter } from "next/navigation";
import { Text } from "@/components/reuseables/text";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Icons from "@/lib/configs/icons.config";
import { authService } from "@/lib/services/authService";

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onShowRegister?: () => void; // ← new callback for "Create an account"
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onShowRegister }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginFields = [
    {
      name: "email",
      label: "Email Address",
      placeholder: "Sam.doe23@gmail.com",
      type: "email",
      icons: [
        {
          icon: <Mail className="h-5 w-5 text-gray-400" />,
          position: "start" as const,
          type: "icon" as const,
        },
      ],
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      icons: [
        {
          icon: <Lock className="h-5 w-5 text-gray-400" />,
          position: "start" as const,
          type: "icon" as const,
        },
      ],
    },
  ];

  const handleLogin = async (data: Record<string, string>) => {
    setErrorMessage(null);
    try {
      await authService.login({ email: data.email, password: data.password });
      console.log("Login successful");

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen flex my-20 items-center justify-center bg-white md:rounded-lg max-w-xl md:shadow-xl px-4 py-12 mx-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Text variant="Heading" as="h1" className="mb-2 text-2xl sm:text-3xl">
            Welcome back
          </Text>

          <Text variant="SubText" color="rgba(0,0,0,0.6)" className="text-sm sm:text-base">
            Access your account to continue where you left off.
          </Text>
        </div>

        {/* Login Form */}
        <FormComponent
          fields={loginFields}
          submitButtonText="Login"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-6 rounded-lg text-lg transition shadow-md hover:shadow-lg"
          formType="login"
          submitFunction={handleLogin}
          classNames="space-y-7"
        />

        {errorMessage && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-4">
          <button
            onClick={authService.googleAuth}
            className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <Image src={Icons.google} alt="Google icon" height={30} width={30} />
            Login with Google
          </button>

          <button 
            onClick={authService.linkedInAuth}
            className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <Image src={Icons.linkedin} alt="LinkedIn" height={30} width={30} />
            Login with LinkedIn
          </button>

          <button 
            onClick={authService.microsoftAuth}
            className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <Image src={Icons.microSoft} alt="Microsoft" height={30} width={30} />
            Login with Microsoft SSO
          </button>
        </div>

        {/* Create Account Button */}
        {onShowRegister && (
          <div className="text-center mt-6">
            <button
              onClick={onShowRegister}
              className="text-brand-primary font-medium hover:underline"
            >
              Create an account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
