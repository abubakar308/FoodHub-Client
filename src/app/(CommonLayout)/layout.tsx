import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { CartProvider } from "@/context/CartContext";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <div className="flex min-h-screen flex-col bg-background">
     <CartProvider>
       <Navbar  />
      <main className="flex-1">{children}</main>
      <Footer />
     </CartProvider>
    </div>
  );
}