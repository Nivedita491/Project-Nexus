import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as it's standard and nice
import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus",
  description: "Campus OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <div className="flex h-screen flex-col md:flex-row bg-[#020617] text-slate-50">
          <Providers>
            {/* Desktop Sidebar - Hidden on Mobile */}
            <Sidebar className="hidden md:flex flex-none" />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {children}
            </main>

            {/* Mobile Bottom Nav - Hidden on Desktop */}
            <BottomNav className="md:hidden" />
          </Providers>
        </div>
      </body>
    </html>
  );
}
