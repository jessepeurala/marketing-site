import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Startup Consulting & Advisory Services | Expert Guidance for Founders",
  description: "Transform your startup vision into reality with expert consulting, strategic guidance, and personalized advisory services. Get comprehensive support for business model development, market positioning, and growth strategy.",
  keywords: "startup consulting, founder advisory, business strategy, startup growth, market positioning, business model development, startup mentoring, founder coaching",
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Company Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Startup Consulting & Advisory Services | Expert Guidance for Founders",
    description: "Transform your startup vision into reality with expert consulting, strategic guidance, and personalized advisory services.",
    url: "https://your-domain.com",
    siteName: "Your Company Name",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Startup Consulting Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Consulting & Advisory Services | Expert Guidance for Founders",
    description: "Transform your startup vision into reality with expert consulting, strategic guidance, and personalized advisory services.",
    images: ["/twitter-image.jpg"],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
    yahoo: "your-yahoo-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4F46E5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Your Company Name",
              description: "Expert startup consulting and strategic guidance to help founders navigate the journey from idea to successful business",
              url: "https://your-domain.com",
              logo: "https://your-domain.com/logo.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "Your City",
                addressRegion: "Your Region",
                postalCode: "Your Postal Code",
                addressCountry: "Your Country",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "your-phone-number",
                contactType: "customer service",
                email: "your-email@domain.com",
              },
              sameAs: [
                "https://linkedin.com/company/your-company",
                "https://twitter.com/your-handle",
                "https://facebook.com/your-company",
              ],
              priceRange: "$$",
              openingHours: "Mo-Fr 09:00-17:00",
              areaServed: "Worldwide",
              serviceType: [
                "Startup Consulting",
                "Founder Advisory",
                "Business Strategy",
                "Growth & Scale",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
