"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Loader2, Building2, MapPin, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { deleteFacility } from "@/actions/cms";
import { useRouter } from "next/navigation";
import { useAdminUI } from "@/providers/AdminUIProvider";

interface FacilitiesListProps {
  initialFacilities: any[];
}

export default function FacilitiesList({ initialFacilities }: FacilitiesListProps) {
  const router = useRouter();
  const { confirm, toast } = useAdminUI();
  const [facilities, setFacilities] = useState(initialFacilities);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: "Hapus Fasilitas?",
      description: `Apakah Anda yakin ingin menghapus fasilitas "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      type: "danger",
      confirmLabel: "Ya, Hapus",
      cancelLabel: "Batal",
      onConfirm: async () => {
        setDeletingId(id);
        const result = await deleteFacility(id);

        if (result.success) {
          setFacilities((prev) => prev.filter((f) => f.id !== id));
          toast({
            title: "Deleted",
            message: "Fasilitas berhasil dihapus.",
            type: "success"
          });
          router.refresh();
        } else {
          toast({
            title: "Error",
            message: "Gagal menghapus fasilitas: " + result.error,
            type: "error"
          });
        }
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Eksplorasi Fasilitas</h2>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-widest text-[11px]">Kelola prasarana dan tour virtual 360°</p>
        </div>
        <Link 
          href="/admin/facilities/new" 
          className="flex items-center gap-2 bg-[#F15A24] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-xs uppercase tracking-widest group"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          <span>Tambah Fasilitas</span>
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-orange-200 transition-all duration-500">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-orange-600 group-hover:text-white">
             <Building2 size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Fasilitas</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{facilities.length}</h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Master</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all duration-500">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-emerald-600 group-hover:text-white">
             <Compass size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Virtual Tour</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {facilities.filter(f => f.isVirtualTour).length}
              </h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Scenes</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-all duration-500">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white">
             <MapPin size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lokasi Kampus</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">1</h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Main</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div key={facility.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 relative">
             <div className="h-40 relative overflow-hidden">
                <Image 
                  src={facility.image || "/images/placeholder.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={facility.title}
                  width={400}
                  height={200}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                   <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
                     {facility.category}
                   </span>
                   {facility.isVirtualTour && (
                     <span className="bg-orange-500 text-white text-[8px] font-black px-3 py-1 rounded-full border border-orange-400 uppercase tracking-widest flex items-center gap-1">
                       <Compass size={8} /> 360° Tour
                     </span>
                   )}
                </div>
             </div>
             
             <div className="p-8 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#F15A24] transition-colors line-clamp-1">
                         {facility.title}
                       </h3>
                       <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md border border-slate-200">
                         QTY: {facility.quantity || 1}
                       </span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed h-8">
                      {facility.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/facilities/${facility.id}`}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                      >
                         <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(facility.id, facility.title)}
                        disabled={deletingId === facility.id}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all shadow-none disabled:opacity-50"
                      >
                         {deletingId === facility.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                   </div>
                   <div className="flex flex-col items-end">
                      <Link 
                        href="/facility" 
                        target="_blank"
                        className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-widest transition-colors"
                      >
                        <span>Preview Page</span>
                        <ExternalLink size={10} />
                      </Link>
                      {facility.isVirtualTour && (
                        <Link 
                          href="/facility-tour" 
                          target="_blank"
                          className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-widest transition-colors mt-1"
                        >
                          <span>Preview Tour</span>
                          <ExternalLink size={10} />
                        </Link>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ))}

        {facilities.length === 0 && (
          <div className="col-span-full py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm">
                <Building2 size={32} />
             </div>
             <div>
                <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Belum ada Fasilitas</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Mulai dengan menambahkan fasilitas kampus pertama Anda.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
