import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal Expense Tracker Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
