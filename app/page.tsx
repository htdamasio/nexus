import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Floater } from '@/components/Floater'
import { Functionalities } from '@/components/Functionalities'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'
import { ReadMockup } from '@/components/ReadMockup'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Floater />
      <ReadMockup />
      <Functionalities />
      <CTA />
      <Footer />
    </>
  )
}
