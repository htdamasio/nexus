"use client";

import { Book, UsersFour, ArrowRight, ArrowDown, PenNib } from "phosphor-react";

export function Floater() {
  return (
    <div className="flex flex-1 flex-col items-center mx-[15%] bg-white rounded-2xl drop-shadow-lg mt-[-2rem] sm:mt-[-6rem]">
      <span className="flex font-rubik text-lg sm:text-2xl font-light mt-5">How it works...</span>
      <div className="flex flex-1 w-full flex-col sm:flex-row justify-around items-center py-10">
        <div className="flex flex-col items-center gap-y-3 text-center">
          <PenNib className="h-24 w-24" weight="thin"/>
          <span className="font-montserrat font-light text-charleston-green max-w-[6rem]">Share your novel</span>
        </div>
        <ArrowRight className="hidden sm:block h-8 w-8 text-united-nations-blue"/>
        <ArrowDown className="sm:hidden h-8 w-8 my-2 text-united-nations-blue"/>

        <div className="flex flex-col items-center gap-y-3 text-center">
          <UsersFour className="h-24 w-24" weight="thin"/>
          <span className="font-montserrat font-light text-charleston-green max-w-[6rem]">Create your community</span>
        </div>
        <ArrowRight className="hidden sm:block h-8 w-8 text-united-nations-blue"/>
        <ArrowDown className="sm:hidden h-8 w-8 my-2 text-united-nations-blue"/>

        <div className="flex flex-col items-center gap-y-3 text-center">
          <Book className="h-24 w-24" weight="thin"/>
          <span className="font-montserrat font-light text-charleston-green max-w-[6rem]">Get published</span>
        </div>

      </div>
      {/* 
        icon
        text
      */}
    </div>
  );
}