import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CustomCursor from '@/components/common/CustomCursor';
import Preloader from '@/components/common/Preloader';
import DottedSurface from '@/components/ui/dotted-surface';
import ThemeProvider from '@/components/common/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI/ML CLUB | Futuristic Artificial Intelligence & Robotics Research Lab',
  description: 'A student-driven technology and research community focused on learning, experimentation, research, and innovation in Artificial Intelligence, Machine Learning, Computer Vision, and Robotics.',
  keywords: [
    'AI Club',
    'Machine Learning',
    'Robotics',
    'Computer Vision',
    'Generative AI',
    'Deep Learning',
    'University AI Society',
    'Student Research',
    'Hackathons'
  ],
  authors: [{ name: 'University AI/ML Club Researchers' }],
  creator: 'AI/ML Club',
  openGraph: {
    title: 'AI/ML CLUB | Futuristic AI & Robotics Laboratory',
    description: 'Explore Artificial Intelligence, Machine Learning, Robotics, Computer Vision and Generative AI in an immersive 3D virtual laboratory.',
    type: 'website',
    locale: 'en_US',
    siteName: 'University AI/ML Club'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI/ML CLUB | Futuristic AI & Robotics Laboratory',
    description: 'Explore Artificial Intelligence, Machine Learning, Robotics, Computer Vision and Generative AI in an immersive 3D virtual laboratory.'
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#000000] text-[#EDEDED] flex flex-col antialiased selection:bg-white selection:text-black overflow-x-hidden relative">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        {/* Full-Page Animated Dotted Wave Background */}
        <DottedSurface className="z-0" opacity={0.55} />
        <div aria-hidden="true" className="content-veil pointer-events-none fixed inset-0 z-0" />

        {/* Futuristic Node-Linking Boot Initializer */}
        <Preloader />

        {/* Multi-State Glowing Custom Cursor */}
        <CustomCursor />

        {/* Sticky Floating Glassmorphic Navigation */}
        <Navbar />

        {/* Main Body */}
        <div className="flex-1 flex flex-col w-full relative z-10">
          {children}
        </div>

        {/* Futuristic Cyber Laboratory Footer */}
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
