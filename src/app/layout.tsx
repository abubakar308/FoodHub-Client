import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quickplatter",
  description: "Order delicious meals from top restaurants near you",
};

import QueryProvider from "@/providers/QueryProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "@/context/CartContext";
import ThemeProvider from "@/providers/ThemeProvider";
import FloatingChatBot from "@/components/ai/FloatingChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              <CartProvider>
                {children}
                <FloatingChatBot />
              </CartProvider>
            </GoogleOAuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
