import type { Metadata } from "next";
import VirtualTour from "@/components/VirtualTour";

export const metadata: Metadata = {
  title: "Virtual Tour 360 | Politeknik",
  description: "Jelajahi secara interaktif kampus Politeknik melalui Virtual Tour 360 derajat.",
};

export default function VirtualTourPage() {
  return (
    <div className="fixed inset-0 z-[999] bg-slate-900 overflow-hidden">
      <VirtualTour />
    </div>
  );
}
