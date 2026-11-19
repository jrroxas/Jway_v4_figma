import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RescueMissionGame from "./RescueMissionGame";
import { getPageMetadata } from "@/lib/getPageMetadata";

export async function generateMetadata() {
  return getPageMetadata("staffing-rescue-mission", {
    title: "Project Rescue Mission | JWay Group Staffing",
    description: "Play JWay's Project Rescue Mission triage game. Fix software development bottlenecks using our top-tier IT experts.",
  });
}

export default function RescueMissionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <RescueMissionGame />
      </main>
      <Footer />
    </div>
  );
}
