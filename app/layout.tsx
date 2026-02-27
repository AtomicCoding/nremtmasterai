import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "NREMT Master AI",
  description: "MVP drill trainer for NREMT prep"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/app/dashboard">Dashboard</Link>
            <Link href="/app/practice">Practice</Link>
            <Link href="/app/history">History</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
