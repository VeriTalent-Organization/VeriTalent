// app/login/page.tsx
"use client";

import FormComponent from "@/components/forms/form";
import { useRouter } from "next/navigation";
import { Text } from "@/components/reuseables/text";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Icons from "@/lib/configs/icons.config";

export default function LoginPage() {
    const router = useRouter();
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

  const handleLogin = async () => {
    // your login logic here
    const success = true; // replace with actual login result
    if (success) {
      router.push("/dashboard"); // redirect to dashboard
    }
  };

  return (
    <div className="min-h-screen flex my-20 items-center md:mx-auto justify-center bg-white md:rounded-lg max-w-xl md:shadow-xl px-4 py-12">

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Text variant="Heading" as="h1" className="mb-2">
            Welcome back
          </Text>

          <Text variant="SubText" color="rgba(0,0,0,0.6)">
            Access your account to continue where you left off.
          </Text>
        </div>

        <div className=" ">

          {/* Reusable Form */}
          <FormComponent
            fields={loginFields}
            submitButtonText="Login"
            submitButtonStyle="w-full bg-brand-primary hover:bg-cyan-700 text-white font-semibold py-6 rounded-lg text-lg transition shadow-md hover:shadow-lg"
            formType="login"
            submitFunction={handleLogin}
            classNames="space-y-7"
          />

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
            <button className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
              <Image src={Icons.google} alt="google icon" height={30} width={30}/>
              Login with Google
            </button>

            <button className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-30 transition font-medium text-gray-700">
              <Image src={Icons.linkedin} alt="linkedln" height={30} width={30}/>
              Login with LinkedIn
            </button>

            <button className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
              <Image src={Icons.microSoft} alt="microsoft" height={30} width={30}/>
             
              Login with Microsoft SSO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
LoginPage.hasNextButton = true;