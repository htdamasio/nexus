"use client";
import { InstagramLogo, FacebookLogo, TwitterLogo } from 'phosphor-react';

export function Footer() {
  return (
    <div className="bg-[length:100%] bg-no-repeat bg-gradient-to-b from-transparent to-[#B3B4EB]">
    <footer className="text-charleston-green py-4">
    <div className="container font-roboto mx-auto flex items-center justify-between px-3">
      <p className="text-xs">&copy; 2023 Nexus. All rights reserved</p>
      <ul className="flex space-x-4">
        <li><a href="#"><TwitterLogo size={24} weight="bold"/></a></li>
        <li><a href="#"><FacebookLogo size={24} weight="bold"/></a></li>
        <li><a href="#"><InstagramLogo size={24} weight="bold"/></a></li>
      </ul>
    </div>
  </footer>
    </div>
  );
}