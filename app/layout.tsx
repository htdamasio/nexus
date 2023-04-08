import './globals.css'

import { AnalyticsWrapper } from '@/components/analytics' 
import { Provider } from '@/lib/provider'
import { montserrat, roboto } from './fonts';


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
