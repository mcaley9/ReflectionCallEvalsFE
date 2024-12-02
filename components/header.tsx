"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FileText, Menu, X, BookOpen, Phone, Video, Presentation } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#faf7f2] text-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-gray-800" />
          <div className="text-xl font-bold">InStage Evals</div>
        </div>

        <nav className="hidden md:flex items-center ml-auto space-x-4">
          <Link
            href="/"
            className="hover:underline text-sm flex items-center space-x-1"
          >
            <BookOpen className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <SignedIn>
            <Link
              href="/evals"
              className="hover:underline text-sm flex items-center space-x-1"
            >
              <FileText className="h-4 w-4" />
              <span>Reflection</span>
            </Link>
            <Link
              href="#"
              className="hover:underline text-sm flex items-center space-x-1"
            >
              <Phone className="h-4 w-4" />
              <span>Phone Interview</span>
            </Link>
            <Link
              href="#"
              className="hover:underline text-sm flex items-center space-x-1"
            >
              <Video className="h-4 w-4" />
              <span>Conference</span>
            </Link>
            <Link
              href="#"
              className="hover:underline text-sm flex items-center space-x-1"
            >
              <Presentation className="h-4 w-4" />
              <span>Demo</span>
            </Link>
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-4 ml-6">
          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-[#faf7f2] text-gray-800 p-4">
          <div className="space-y-2">
            <div>
              <Link
                href="/"
                className="block hover:underline text-sm flex items-center space-x-1"
                onClick={toggleMenu}
              >
                <BookOpen className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>

            <SignedIn>
              <div>
                <Link
                  href="/evals"
                  className="block hover:underline text-sm flex items-center space-x-1"
                  onClick={toggleMenu}
                >
                  <FileText className="h-4 w-4" />
                  <span>Reflection</span>
                </Link>
              </div>
              <div>
                <Link
                  href="#"
                  className="block hover:underline text-sm flex items-center space-x-1"
                  onClick={toggleMenu}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone Interview</span>
                </Link>
              </div>
              <div>
                <Link
                  href="#"
                  className="block hover:underline text-sm flex items-center space-x-1"
                  onClick={toggleMenu}
                >
                  <Video className="h-4 w-4" />
                  <span>Conference</span>
                </Link>
              </div>
              <div>
                <Link
                  href="#"
                  className="block hover:underline text-sm flex items-center space-x-1"
                  onClick={toggleMenu}
                >
                  <Presentation className="h-4 w-4" />
                  <span>Demo</span>
                </Link>
              </div>
            </SignedIn>
          </div>
        </nav>
      )}
    </header>
  );
}
