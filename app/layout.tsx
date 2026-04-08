import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediSync | Premium Hospital Appointment System",
  description: "Book your healthcare appointments with ease at MediSync Hospital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-primary/20">
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg medical-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">MediSync</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="/doctors" className="hover:text-primary transition-colors">Our Doctors</a>
              <a href="/appointments" className="hover:text-primary transition-colors">My Appointments</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-primary hover:text-primary/80">
                Sign In
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white primary-gradient rounded-full medical-gradient shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Book Appointment
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-slate-50 py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded flex items-center justify-center medical-gradient">
                  <span className="text-white font-bold text-sm">+</span>
                </div>
                <span className="font-bold text-lg tracking-tight">MediSync</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                Advanced healthcare solutions for a healthier tomorrow. Quality care, expert doctors, and seamless booking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Medical Services</a></li>
                <li><a href="#" className="hover:text-primary">Emergency Care</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>123 Healthcare Ave</li>
                <li>Medical City, MC 12345</li>
                <li>+1 (555) 123-4567</li>
                <li>support@medisync.com</li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border flex justify-between items-center text-xs text-slate-400">
            <p>© 2026 MediSync Hospital Group. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
