import "../app/globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Header from "../components/Header";
import FooterNav from "../components/Footer";
import Providers from "./providers"
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
      </head>
      <Providers>
      <body
        className={`min-w-screen ${inter.className} flex justify-center`}
        >
          <div className="min-h-screen w-full 2xl:w-4/5 flex flex-col items-center">
        <Header />
        <main className="flex-1 bg-red-500 w-full flex flex-col items-center justify-around">
          {children}
        </main>
        <FooterNav />
          </div>
      </body>
        </Providers>
    </html>
  );
}
