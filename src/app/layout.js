import "./globals.css";

export const metadata = {
  title: "Debug Duty",
  description: "A QA game: find the hidden bugs and report them.",
};

// The layout wraps every page in the app. Next.js renders each page inside {children}.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
