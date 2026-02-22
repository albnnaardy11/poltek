import type { Metadata } from "next";
import VirtualTour from "@/components/VirtualTour";

export const metadata: Metadata = {
  title: "Virtual Tour 360 | Politeknik",
  description: "Jelajahi secara interaktif kampus Politeknik melalui Virtual Tour 360 derajat.",
};

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Virtual Tour <span className="text-primary">360&deg;</span>
          </h1>
          <p className="text-lg text-slate-600">
            Jelajahi area kampus Politeknik secara interaktif. Gunakan panel di sebelah kiri untuk berpindah ruangan dan geser gambar untuk melihat sekeliling.
          </p>
        </div>

        <div className="w-full">
          <VirtualTour />
        </div>
      </div>
    </div>
  );
}
