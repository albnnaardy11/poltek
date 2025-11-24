"use client";

import Hero from "@/components/program/Hero";
import About from "@/components/program/About";
import Prospects from "@/components/program/Prospects";
import Tools from "@/components/program/Tools";
import Tour from "@/components/program/Tour";
import FAQ from "@/components/program/FAQ";

export default function ProgramRPLPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <Prospects />
      <Tools />
      <Tour program="pplg" />
      <FAQ />
    </main>
  );
}
