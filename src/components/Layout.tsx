import { type ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-12 pb-28 md:pt-28 md:pb-12">
        {children}
      </main>
    </div>
  );
}
