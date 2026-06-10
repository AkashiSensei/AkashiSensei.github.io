import { type ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 w-full px-6 pt-12 pb-28 sm:px-8 md:px-16 md:pt-28 md:pb-12 lg:px-64">
        {children}
      </main>
    </div>
  );
}
