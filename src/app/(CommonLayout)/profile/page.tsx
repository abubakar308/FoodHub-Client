"use client"; // IMPORTANT: enable client-side rendering

import { useEffect, useState } from "react";
import { getUser, ProfileResponse } from "@/services/user";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  role?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res: ProfileResponse<UserData> = await getUser();

      if (!res.data) {
        router.push("/login"); // redirect if no user
      } else {
        setUser(res.data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

      <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
        {/* Name */}
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-lg font-medium">{user?.name || "N/A"}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-lg font-medium">{user?.email || "N/A"}</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-gray-400 text-sm">Role</p>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium mt-1">
            {user?.role || "CUSTOMER"}
          </span>
        </div>

        {/* Edit button */}
        <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
}