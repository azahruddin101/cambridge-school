import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import InlineScript from "@/components/providers/InlineScript";
import { site } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL("https://easterncambridgeschool.co.in"),
  title: {
    default: `${site.name} — ${site.motto}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    images: ["/images/campus/main-building.webp"],
    type: "website",
  },
};

export const viewport = {
  themeColor: "#1c3a2d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags JS support before first paint so reveal elements can start hidden without flashing */}
        <InlineScript html={`document.documentElement.classList.add("js")`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
