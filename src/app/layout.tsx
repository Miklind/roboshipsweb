import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TitleBar from '@/components/TitleBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roboships (demo)',
  description: 'Roboships is react skill demonstration project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='flex-col flex h-screen max-h-screen'>
          <TitleBar/>
          {children}
          <Footer/>
          </div>
        </body>
    </html>
  )
}
