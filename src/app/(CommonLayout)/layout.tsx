import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { userService } from "@/services/user.service";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
 const user = await userService.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}