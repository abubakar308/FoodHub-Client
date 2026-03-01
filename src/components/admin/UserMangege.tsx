"use client";
import { getUsers, updateUserStatus } from "@/services/admin";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react"; // আইকন ব্যবহারের জন্য

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, status: "ACTIVE" | "SUSPENDED") => {
    try {
      await updateUserStatus(userId, status);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      toast.success(`User ${status === "ACTIVE" ? "activated" : "suspended"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  if (loading) return <p className="text-center p-6 text-gray-500">Loading users...</p>;
  if (!users.length) return <p className="text-center p-6 text-gray-500">No users found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Users: {users.length}
        </p>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full bg-white overflow-hidden">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Name</th>
              <th className="text-left p-4 font-semibold text-gray-600">Email</th>
              <th className="text-left p-4 font-semibold text-gray-600">Role</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 font-semibold text-gray-600">Created At</th>
              <th className="text-right p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  {/* ✅ Logic: ADMIN রোল হলে বাটন দেখাবে না */}
                  {user.role === "ADMIN" ? (
                    <div className="flex items-center justify-end gap-1 text-slate-400 italic text-xs font-medium">
                      <ShieldCheck size={14} /> System Protected
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {user.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleStatusChange(user.id, "SUSPENDED")}
                          className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 px-3 py-1 rounded-md text-sm transition-all"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user.id, "ACTIVE")}
                          className="bg-green-50 hover:bg-green-500 text-green-600 hover:text-white border border-green-200 px-3 py-1 rounded-md text-sm transition-all"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}