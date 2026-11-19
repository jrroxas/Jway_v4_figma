import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getPayloadClient } from "@/lib/getPayload";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Solutions Agency | JWay Group Inc.",
  description:
    "JWay Group is a full-service technology and digital solutions company with over 20 years of experience in the industry.",
};

function parseHtmlAttributes(attrString: string): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {};
  const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;

  const attrMap: Record<string, string> = {
    class: "className",
    crossorigin: "crossOrigin",
    referrerpolicy: "referrerPolicy",
    fetchpriority: "fetchPriority",
    nomodule: "noModule",
    charset: "charSet",
    "http-equiv": "httpEquiv",
  };

  while ((match = attrRegex.exec(attrString)) !== null) {
    const rawName = match[1];
    const value = match[2] ?? match[3] ?? match[4];
    const mappedName = attrMap[rawName.toLowerCase()] || rawName;
    attrs[mappedName] = value !== undefined ? value : true;
  }

  return attrs;
}

function renderHeaderElements(rawHtml: string): React.ReactNode[] {
  if (!rawHtml || !rawHtml.trim()) return [];

  const withoutComments = rawHtml.replace(/<!--[\s\S]*?-->/g, "");
  const elements: React.ReactNode[] = [];
  const tagRegex =
    /<(script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\1>|<(meta|link|base)\b([^>]*?)\/?>/gi;

  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = tagRegex.exec(withoutComments)) !== null) {
    const key = `head-injected-${index++}`;

    if (match[1]) {
      const Tag = match[1].toLowerCase() as "script" | "style" | "noscript";
      const attrs = parseHtmlAttributes(match[2] || "");
      const innerHtml = match[3] || "";

      if (innerHtml.trim()) {
        elements.push(
          <Tag
            key={key}
            {...attrs}
            dangerouslySetInnerHTML={{ __html: innerHtml }}
          />
        );
      } else {
        elements.push(<Tag key={key} {...attrs} />);
      }
    } else if (match[4]) {
      const VoidTag = match[4].toLowerCase() as "meta" | "link" | "base";
      const attrs = parseHtmlAttributes(match[5] || "");
      elements.push(<VoidTag key={key} {...attrs} />);
    }
  }

  return elements;
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headerScripts = "";
  let bodyScripts = "";
  let footerScripts = "";

  try {
    const payload = await getPayloadClient();
    const scripts = (await payload.findGlobal({
      slug: "header-footer-scripts",
    })) as { headerScripts?: string; bodyScripts?: string; footerScripts?: string } | null;

    if (scripts) {
      headerScripts = scripts.headerScripts || "";
      bodyScripts = scripts.bodyScripts || "";
      footerScripts = scripts.footerScripts || "";
    }
  } catch (error) {
    console.error("[HeaderFooterScripts Layout] Failed to load scripts:", error);
  }

  return (
    <html
      lang="en"
      className={`h-full antialiased ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>{renderHeaderElements(headerScripts)}</head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {bodyScripts && (
          <div
            id="injected-body-scripts"
            dangerouslySetInnerHTML={{ __html: bodyScripts }}
            style={{ display: "contents" }}
          />
        )}
        {children}
        {footerScripts && (
          <div
            id="injected-footer-scripts"
            dangerouslySetInnerHTML={{ __html: footerScripts }}
            style={{ display: "contents" }}
          />
        )}
      </body>
    </html>
  );
}
