import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://rateradar.in";
const SITE_NAME = "Rate Radar";
const SITE_DESCRIPTION =
  "Compare USD to INR conversion rates across various Fintech platforms and banks. See exactly what you'll receive after all fees, markups, and taxes — pick the option that puts the most rupees in your account.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Rate Radar — Best USD to INR Conversion Rate Comparison",
    template: "%s | Rate Radar",
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "USD to INR",
    "currency conversion",
    "forex rates India",
    "best exchange rate",
    "Skydo rates",
    "Mulya rates",
    "Infinity App rates",
    "IDFC First Bank forex",
    "IOB exchange rate",
    "ICICI Bank forex",
    "Toptal ICICI rate",
    "Toptal India payout",
    "international transfer fees",
    "wire transfer India",
    "freelancer forex",
    "remittance comparison",
    "forex charges comparison",
    "USD INR live rate",
    "best forex rate India",
    "international payment India",
    "foreign exchange India",
    "money transfer comparison",
    "dollar to rupee",
  ],

  applicationName: SITE_NAME,
  authors: [{ name: "Rate Radar" }],
  creator: "Rate Radar",
  publisher: "Rate Radar",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Rate Radar — Best USD to INR Conversion Rate Comparison",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rate Radar — Compare USD to INR conversion rates across platforms",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Rate Radar — Best USD to INR Conversion Rate Comparison",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
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

  alternates: {
    canonical: SITE_URL,
  },

  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9FF" },
    { media: "(prefers-color-scheme: dark)", color: "#111964" },
  ],
};

// JSON-LD structured data for rich search results
function JsonLd() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Live USD to INR exchange rate comparison",
      "Skydo forex rate comparison",
      "Mulya forex rate comparison",
      "Infinity App forex rate comparison",
      "IDFC First Bank forex rate comparison",
      "Indian Overseas Bank (IOB) forex rate comparison",
      "ICICI Bank forex rate comparison (Toptal member offer)",
      "Total fee breakdown including GST",
      "Effective exchange rate calculation",
      "Best and worst option highlighting",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best platform to convert USD to INR in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best platform depends on the transfer amount, as fee structures vary. Rate Radar compares Svarious Fintech platforms and banks in real time to show you which gives the highest effective rate after all fees, markups, and taxes.",
        },
      },
      {
        "@type": "Question",
        name: "How does Rate Radar calculate the effective exchange rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rate Radar fetches live exchange rates from each platform, applies their specific fee structures (transaction fees, GST, forex markups, bank charges), and calculates the final INR amount you receive. The effective rate = (Final INR received) ÷ (USD sent).",
        },
      },
      {
        "@type": "Question",
        name: "Which platforms does Rate Radar compare?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rate Radar compares six options: Skydo, Mulya, and Infinity App (fintechs), plus IDFC First Bank, Indian Overseas Bank (IOB), and ICICI Bank as banking options. The ICICI option reflects the special mid-market rate offered to Toptal members, which carries no forex markup.",
        },
      },
      {
        "@type": "Question",
        name: "Is Rate Radar free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Rate Radar is completely free. It is an open-source tool that fetches live rates and shows you a transparent comparison with no hidden charges.",
        },
      },
      {
        "@type": "Question",
        name: "How often are exchange rates updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Exchange rates are fetched live from each platform and the mid-market rate from Frankfurter API. Rates are cached for 5 minutes to balance freshness with API reliability.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(inter.className, "font-sans", geist.variable)}
    >
      <head>
        <JsonLd />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className='max-w-5xl mx-auto px-4 mt-10 pb-5 bg-[#F7F9FF]'>
        <main>{children}</main>
      </body>
    </html>
  );
}
