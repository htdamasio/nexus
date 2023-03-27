"use client"

import Image from "next/image";
import { House, Books, Pencil, ListBullets } from "phosphor-react";
import Link from "next/link";

export function MobileFooterMenu() {
  const bookID = 'Sdjk31-asd-123s-sdffdf-435sefs'
  return (
    <nav className="
        fixed w-full bottom-0 h-14 bg-[#F0F0F0] dark:bg-[#212121] z-10
        flex flex-row justify-evenly items-center
        lg:hidden
      ">
        <Link href="/" className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-[#6818A5] dark:text-[#fafafa] dark:hover:text-[#DC97FF]">
          <House className="w-7 h-7"/>
          <p className="text-xs">Home</p>
        </Link>
        <Link href="/library" className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-[#6818A5] dark:text-[#fafafa] dark:hover:text-[#DC97FF]">
          <Books className="w-7 h-7"/>
          <p className="text-xs">Library</p>
        </Link>
        <Link className="border -mt-5 border-[#6818A5] dark:border-[#DC97FF] rounded-md overflow-hidden" href={`/read/${bookID}`}>
          <Image width={200*.2} height={300*.2} object-fit="contain" alt="book title" src="/nexus-book-placeholder.png"/>
          {/* Book */}
        </Link>
        <Link href="/write/new-book" className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-[#6818A5] dark:text-[#fafafa] dark:hover:text-[#DC97FF]">
          <Pencil className="w-7 h-7"/>
          <p className="text-xs">Write</p>
        </Link>
        <Link href="/more" className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-[#6818A5] dark:text-[#fafafa] dark:hover:text-[#DC97FF]">
          <ListBullets className="w-7 h-7"/>
          <p className="text-xs">More</p>
        </Link>
      </nav>
  );
}