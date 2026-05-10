import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pothik — Travel Bangladesh smarter",
    template: "%s | Pothik",
  },
  description:
    "Book bus tickets across Bangladesh with real-time seat selection, transparent pricing, and zero hassle. Pothik makes intercity travel feel effortless.",
  keywords: [
    "bus ticket Bangladesh",
    "Pothik",
    "online bus booking",
    "Dhaka to Sylhet",
    "Cox's Bazar bus",
    "intercity travel",
  ],
  openGraph: {
    title: "Pothik — Travel Bangladesh smarter",
    description:
      "Book bus tickets with real-time seat selection. Modern, fast, transparent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className:
                "!bg-ink-900 !text-white !rounded-xl !text-sm !shadow-lg",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
