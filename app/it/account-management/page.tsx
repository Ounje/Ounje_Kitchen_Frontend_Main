"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserX, Trash2, Search } from "lucide-react";

export default function AccountManagementPage() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    accountStatus: "",
  });

  const handleNavigate = (type: "suspended" | "deleted") => {
    router.push(`/it/account-management/${type}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Management</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage suspended and deleted accounts across the platform
        </p>
      </div>

      {/* Search/Filter Form */}
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-[#1a3f1c]" />
            <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={searchFilters.name}
                onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={searchFilters.email}
                onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={searchFilters.phoneNumber}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, phoneNumber: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="status">Account Status</Label>
              <Select
                value={searchFilters.accountStatus}
                onValueChange={(value) =>
                  setSearchFilters({ ...searchFilters, accountStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Suspended Accounts Card */}
        <Card
          className="border-2 border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          onClick={() => handleNavigate("suspended")}
        >
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UserX className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Suspended Accounts</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              View and manage all suspended user accounts
            </p>
            <Button
              className="w-full"
              style={{ backgroundColor: "#ffca3a", color: "#1a3f1c" }}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("suspended");
              }}
            >
              View Suspended Accounts
            </Button>
          </CardContent>
        </Card>

        {/* Deleted Accounts Card */}
        <Card
          className="border-2 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          onClick={() => handleNavigate("deleted")}
        >
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Trash2 className="h-10 w-10 md:h-12 md:w-12 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Deleted Accounts</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              View and restore deleted user accounts
            </p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("deleted");
              }}
            >
              View Deleted Accounts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="border shadow-sm" style={{ backgroundColor: "#e8f7e8" }}>
        <CardContent className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-[#1a3f1c] mb-4">Account Management Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Suspended Accounts:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Temporarily disabled accounts</li>
                <li>Can be reactivated instantly</li>
                <li>User data remains intact</li>
                <li>Access is blocked until activation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Deleted Accounts:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Soft-deleted accounts</li>
                <li>Can be restored within retention period</li>
                <li>Data marked for deletion</li>
                <li>Permanent deletion after 30 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
