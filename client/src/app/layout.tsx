
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/redux/Provider"
import { Poppins, Pacifico, Dancing_Script} from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AppInitializer from "@/components/appInitializer";


const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // 
  weight: ['400', '600', '700'],
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: "Nails by ronnie",
  description: "Nails by ronnie is a application that links customers with the best nailtechnician in lagos, it is easy to use and user friendly",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${pacifico.variable} min-h-screen`}
      >
        <Providers>
          <AppInitializer />
          <main>
            <div className="w-full min-h-screen">
              {children}
            </div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}


