"use client"
import { SessionProvider } from "next-auth/react"

interface ProvideProps {
  children: React.ReactNode
}

export function Provider({children}: ProvideProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}