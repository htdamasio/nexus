import { Oswald, Montserrat, Rubik, Roboto, Inter } from 'next/font/google'

// const oswald = Oswald({
//   subsets: ['latin'],
//   weight: ['400'],
//   variable: '--font-oswald'
// })

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat'
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '500'],
  variable: '--font-inter'
})

// const rubik = Rubik({
//   subsets: ['latin'],
//   weight: ['300', '400','700'],
//   variable: '--font-rubik' 
// });

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '500'],
  variable: '--font-roboto' 
});