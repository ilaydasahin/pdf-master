"use client";

import { siteConfig } from "@/config/site";

interface StructuredDataProps {
  type: "organization" | "website" | "breadcrumb" | "software";
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = siteConfig.url || "https://pdftools.com";

  const getStructuredData = () => {
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "PDF Tools",
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description:
            "Free online PDF tools for merging, splitting, compressing, and converting PDF files.",
          sameAs: [
            // Add social media profiles when available
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            availableLanguage: ["English", "Turkish"],
          },
        };

      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PDF Tools",
          url: baseUrl,
          description:
            "Free online PDF tools. Merge, split, compress, convert PDFs and more. No installation required.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        };

      case "software":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "PDF Tools",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "1234",
            bestRating: "5",
            worstRating: "1",
          },
          operatingSystem: "Web Browser",
          description:
            "Free online PDF tools including merge, split, compress, convert, and more.",
          featureList: [
            "Merge PDFs",
            "Split PDFs",
            "Compress PDFs",
            "Convert Office to PDF",
            "Convert PDF to Images",
            "OCR PDF",
            "Password Protect PDFs",
          ],
        };

      case "breadcrumb":
        return data || "";

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Helper to generate breadcrumb structured data
export function generateBreadcrumb(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
