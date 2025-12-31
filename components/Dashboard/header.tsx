"use client";
import React, { useRef, useState }from "react";
import { Search, Plus, User, List, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/reuseables/text";
import Link from "next/link";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";
import { useIsMobile } from "@/lib/configs/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user } = useCreateUserStore();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSecondaryNav, setShowSecondaryNav] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [animateSearch, setAnimateSearch] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchRef = useRef<HTMLDivElement | null>(null);  
  const [isOpen, setIsOpen] = useState(false); 


  return (
    <div className="bg-white border-b sticky z-999 top-0 border-gray-200 px-4 md:px-8 py-4">
      {!isMobile ? (
        <div className="flex items-center justify-between">
          <Text variant="SubHeadings" as="h2" className="text-gray-900">
            Dashboard
          </Text>

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
            {user.user_type !== userTypes.TALENT && (
              <Link
                href="/dashboard/postAJob"
                className="flex items-center text-sm bg-brand-primary hover:bg-cyan-700 text-white px-3 py-2 rounded"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            )}
            {/* User Icon */}
            <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      ) : ( 
        <>
          <div className="flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button> */}
              <Menu
                className="text-gray-800 w-5 h-5 cursor-pointer"
                onClick={onMenuClick}
              />
              <Link href={"/"} className="relative">
                Dashboard
              </Link>
            </div>
            

            <div className="flex items-center gap-4">
              <Search
                className="text-gray-800 w-5 h-5 cursor-pointer"
                onClick={() => setMobileSearch(true)}
              />

              {/* Post a Job Button */}
              {user.user_type !== userTypes.TALENT && (
                <Link
                  href="/dashboard/postAJob"
                  className="flex items-center bg-brand-primary hover:bg-cyan-700 text-white px-1 py-1 rounded"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              )}
              
              <User
                className="text-gray-800 w-5 h-5 cursor-pointer"
                // onClick={() => setShowMobileAccount(prev => !prev)}
              />
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {mobileSearch && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-full bg-white flex items-center gap-3 px-4 py-3 shadow-md z-50"
              >
                <Search className="text-gray-800 w-5 h-5" />
                <Input
                  defaultValue={searchQuery}
                  // onChange={(e) => {
                  //   const q = e.target.value;
                  //   setSearchQuery(q);
                  //   handleDebouncedSearch(q);
                  // }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     const q = (e.currentTarget as HTMLInputElement).value;
                  //     router.push(`/marketplace?q=${encodeURIComponent(q)}`);
                  //     setSearchResults(null);
                  //     setMobileSearch(false);
                  //   }
                  // }}
                  placeholder="Search industrial products..."
                  className="border-none outline-none shadow-none focus:ring-0 flex-1"
                />
                <Button
                  variant="ghost"
                  onClick={() => setMobileSearch(false)}
                  className="text-gray-700"
                >
                  ✕
                </Button>
                {/* {searchResults !== null && (
                  <div className="absolute left-0 top-[6vh] mt-2 w-full bg-white rounded-b-lg shadow-lg z-50 max-h-64 overflow-auto">
                    {isSearching ? (
                      <div className="p-3">
                        <ul className="divide-y">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <li key={i} className="px-3 py-2">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden flex-shrink-0 animate-pulse" />
                                <div className="flex-1">
                                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
                                  <div className="h-2 bg-gray-200 rounded w-1/3 animate-pulse" />
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        No results
                      </div>
                    ) : (
                      <>
                        <ul className="divide-y">
                          {searchResults.slice(0, 6).map((p) => (
                            <li key={p.id} className="px-3 py-2 hover:bg-gray-50">
                              <Link
                                href={`/products/${p.slug}`}
                                className="flex items-center gap-3"
                              >
                                <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  {p.images && p.images[0] ? (
                                    <Image
                                      src={constructImageUrl(p.images[0])}
                                      alt={p.name}
                                      width={40}
                                      height={40}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                      No image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 text-sm">
                                  <div className="font-medium text-foreground">
                                    {p.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {p.price} Lagos, Nigeria
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <div className="p-2 border-t text-center">
                          <Link
                            href={`/products?q=${encodeURIComponent(
                              searchQuery || ""
                            )}`}
                            className="text-sm font-medium text-primary"
                          >
                            See all results
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )} */}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )
              
      }
    </div>
  );
}