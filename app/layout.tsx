import './globals.css'
import { Oswald, Montserrat, Rubik, Roboto } from 'next/font/google'
import { AnalyticsWrapper } from '@/components/analytics' 
import { Provider } from '@/lib/provider'


// const oswald = Oswald({
//   subsets: ['latin'],
//   weight: ['400'],
//   variable: '--font-oswald'
// })

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-montserrat'
})

// const rubik = Rubik({
//   subsets: ['latin'],
//   weight: ['300', '400','700'],
//   variable: '--font-rubik' 
// });

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '500'],
  variable: '--font-roboto' 
});

export const metadata = {
  title: 'Nexus',
  description: 'Making great stories come to live',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`
      ${montserrat.variable} font-montserrat
      ${roboto.variable} font-roboto
      `}
    >
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
      <AnalyticsWrapper />
    </html>
  )
}
