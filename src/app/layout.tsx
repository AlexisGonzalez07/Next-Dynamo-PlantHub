import "../app/globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Header from "../components/Header";
import FooterNav from "../components/Footer";
export const metadata = {
  title: "PlantHub",
  description: "A plant platform for species recognition and care instructions",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="5Xzl4EDlS38QJSKo4iDRxcca9-ElZPXPp3lzYiANlo8" />
      </head>
      <body
        className={`min-h-screen flex flex-col items-center justify-between bg-blue-500 ${inter.className}`}
      >
        <Header />
        <main className="flex-1 bg-red-500 w-full flex flex-col items-center justify-around">
          {children}
        </main>
        <FooterNav />
      </body>
    </html>
  )
}
