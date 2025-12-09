"use client";

import { Search, Plus, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="bg-white border-b sticky top-0 border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Post a Job Button */}
          <Link
            href="/dashboard/postAJob"
            className="flex items-center bg-brand-primary hover:bg-cyan-700 text-white px-3 py-2 rounded"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Link>

          {/* User Icon */}
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
