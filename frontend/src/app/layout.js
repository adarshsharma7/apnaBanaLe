import { Quicksand, Playfair_Display } from "next/font/google";
import { BGMProvider } from "../context/BGMContext";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "Suno na, Manshika ji... 🌸✨",
  description: "6 din ki chhoti si pyaari kahani — sirf aapke liye ✨",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>"
        />
      </head>
      <body
        className={`${quicksand.variable} ${playfair.variable} font-sans min-h-full bg-gradient-to-br from-[#fff5f7] via-[#fff0f5] to-[#f3e8ff] text-[#2d2633] relative flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <BGMProvider>{children}</BGMProvider>
      </body>
    </html>
  );
}
