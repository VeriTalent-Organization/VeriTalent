// "use client";
// import { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   FileText,
//   ClipboardList,
//   FileCheck,
//   CreditCard,
//   Briefcase,
//   Bell,
//   User,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useCreateUserStore } from "@/lib/stores/form_submission_store";
// import { userTypes } from "@/types/user_type";

// type menuItemsType = {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//   label: string;
//   href: string;

// }

// export default function Sidebar() {
//   const [activeRoute, setActiveRoute] = useState("/dashboard");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const { user } = useCreateUserStore();

//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) setIsOpen(false);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const roleLabels:Record<string, string> = {
//     TALENT: "Talent",
//     INDEPENT_RECRUITER: "Independent Recruiter",
//     ORGANISATION: "Company Administrator",
//   };

//   const menuItemsByRole: Record<string, menuItemsType[]> = {
//     TALENT: [
//       { icon: CreditCard, label: "Veritalent AI Card", href: "/dashboard/ai-card" },
//       { icon: FileText, label: "Career Repository", href: "/dashboard/career-repository" },
//       { icon: Briefcase, label: "Jobs & Opportunities", href: "/dashboard/jobs" },
//       { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
//       { icon: User, label: "Profile", href: "/dashboard/profile" },
//     ],
//     INDEPENT_RECRUITER: [
//       { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//       { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
//       { icon: ClipboardList, label: "Screening Interface", href: "/dashboard/screening" },
//       { icon: FileCheck, label: "Recommendation Issuance", href: "/dashboard/recommendation" },
//       { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
//       { icon: User, label: "Profile", href: "/dashboard/profile" },
//     ],
//     ORGANISATION: [
//       { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//       { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
//       { icon: ClipboardList, label: "Screening Interface", href: "/dashboard/screening" },
//       { icon: FileCheck, label: "References & Verifications", href: "/dashboard/references" },
//       { icon: Settings, label: "Account Management", href: "/dashboard/account" },
//       { icon: User, label: "Profile", href: "/dashboard/profile" },
//     ]
//   };

//   const menuItems = menuItemsByRole[user.user_type] || [];

//   return (
//     <div className="relative">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//       >
//         {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
//       </button>

//       {/* Overlay */}
//       {isOpen && isMobile && (
//         <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`${isMobile ? 'fixed left-0 top-0 h-full' : 'relative h-screen'} ${
//           isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
//         } transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 flex flex-col z-40 ${
//           isMobile ? 'shadow-2xl' : ''
//         }`}
//       >
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
//               <path d="M20 5L5 15L20 25L35 15L20 5Z" fill="#0D7490" />
//               <path d="M5 25L20 35L35 25" stroke="#0D7490" strokeWidth="2" />
//             </svg>
//             <span className="text-xl font-bold text-gray-800">VeriTalent</span>
//           </div>
//         </div>

//         {/* User Info */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//             {roleLabels[user.user_type]}
//           </div>
//           <div className="font-semibold text-gray-900 mb-0.5">{user.full_name}</div>
//           <div className="text-xs text-gray-500 truncate">{user.email}</div>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//           {menuItems.map((item) => {
//             const active = activeRoute === item.href || activeRoute.startsWith(`${item.href}/`);
//             const Icon = item.icon;

//             return (
//               <button
//                 key={item.href}
//                 onClick={() => {
//                   setActiveRoute(item.href);
//                   if (isMobile) setIsOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
//                   active
//                     ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
//                     : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                 }`}
//               >
//                 <Icon className="w-5 h-5 shrink-0" />
//                 <span className="text-left truncate">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-200">
//           <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm transition-all duration-200">
//             <LogOut className="w-5 h-5 shrink-0" />
//             <span>Log out</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }