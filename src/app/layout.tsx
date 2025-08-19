import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Mini Movie Search Save App",
  description: "Search OMDb and save favourites"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-[85vh]">{children}</main>
      </body>
    </html>
  );
}
