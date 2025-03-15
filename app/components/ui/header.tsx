import React from "react";
import Link from "next/link";
import { MainNav } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">Kanban Calendar</span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
} 