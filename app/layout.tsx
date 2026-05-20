import "./globals.css";

export const metadata = {
  title: "NutriVision AI",
  description: "Sistem Optimasi Diet & Latihan Fisik AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}