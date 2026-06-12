import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
import { AuthProvider } from '@/components/AuthProvider';
import Chatbot from '@/components/Chatbot';

export const metadata = {
  title: 'NovaCraft Digital — Web Development & Social Media Marketing',
  description: 'NovaCraft Digital builds stunning websites and drives powerful social media growth for businesses, stores, and brands worldwide.',
  keywords: 'web development, social media marketing, website design, digital agency, ecommerce',
  openGraph: {
    title: 'NovaCraft Digital',
    description: 'We build stunning digital experiences that grow your business.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>
        <AuthProvider>
          <PageLoader />
          <div data-global-nav><Navbar /></div>
          <main>{children}</main>
          <div data-global-footer><Footer /></div>
          <div data-global-chatbot><Chatbot /></div>
        </AuthProvider>
      </body>
    </html>
  );
}

