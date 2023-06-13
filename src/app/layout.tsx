import "../app/globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import FooterNav from "../components/Footer";
import Providers from "./providers";
export const metadata = {
  title: "PlantHub",
  description: "A plant platform for species recognition and care instructions",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="5Xzl4EDlS38QJSKo4iDRxcca9-ElZPXPp3lzYiANlo8"
        />
        <meta name="theme-color" content="#ebdbae"/>
        <link rel="manifest" href="./manifest.json" />
      </head>
      <Providers>
        <body className={`min-w-screen ${inter.className} flex bg-primary justify-center h-auto flex-col items-center min-h-screen`}>
            <main className="w-full flex-1 flex flex-col items-center justify-around 2xl:w-4/5 text-secondary mb-16 overflow-y-auto">
              {children}
            </main>
            <FooterNav />
        </body>
      </Providers>
    </html>
  );
}
