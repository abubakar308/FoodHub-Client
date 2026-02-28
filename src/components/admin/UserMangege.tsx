"use client";
import { getUsers, updateUserStatus } from "@/services/admin";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  console.log(users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        console.log(data)
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Created At</th>
              <th className="text-left p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
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
                <td className="p-4 flex gap-2">
                  {user.status === "ACTIVE" ? (
                    <button
                      onClick={() => handleStatusChange(user.id, "SUSPENDED")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(user.id, "ACTIVE")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Activate
                    </button>
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