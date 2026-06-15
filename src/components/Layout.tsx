import { type ReactNode } from "react";
import { Navbar } from "./Navbar";

type LayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

export function Layout({ children, mainClassName = "" }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className={`flex-1 w-full px-5 pt-12 pb-28 sm:px-8 md:px-14 md:pt-24 md:pb-10 lg:px-18 xl:px-24 2xl:px-32 min-[1800px]:!px-52 ${mainClassName}`}>
        {children}
      </main>
    </div>
  );
}
