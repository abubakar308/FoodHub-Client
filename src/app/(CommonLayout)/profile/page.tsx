import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
 const user = await userService.getUser();

 console.log(user.data)


  if (!user.data) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center">My Profile</h2>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.data.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.data.email}</p>
        </div>

        <div className="pt-2 border-t mt-2">
            <p className="text-sm text-gray-500">Role</p>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1 font-medium">
                {user.data.role || "CUSTOMER"}
            </span>
        </div>

        <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
          Edit Profile
        </button>
      </div>
    </div>
  );
}