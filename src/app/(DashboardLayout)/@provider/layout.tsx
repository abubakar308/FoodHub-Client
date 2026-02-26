import Link from "next/link";


const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">
          <Link href="/">FoodHub</Link>
        </h1>
        <nav className="flex flex-col gap-4">
          <a
            href="/dashboard"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/create-provider-profile"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            create-provider-profile
          </a>

          <a
            href="/dashboard/delete-meals"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            Update & Delete Meals
          </a>
          <a
            href="/dashboard/add-menu"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            Add Menu Items
          </a>
          <a
            href="/dashboard/orders"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            Orders
          </a>
          <a
            href="/profile"
            className="text-gray-700 font-medium hover:text-blue-500"
          >
            Profile
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default layout;