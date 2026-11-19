import HomepageClient from "./HomepageClient";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata("home", {
    title: "Build Smarter. Apply AI. Put Talent to Work.",
    description:
      "From designing and engineering digital platforms to introducing AI into everyday operations and deploying specialized technology professionals, we bring the expertise to turn ambitious plans into working technology.",
  });
}

export default function Home() {
  return <HomepageClient />;
}
