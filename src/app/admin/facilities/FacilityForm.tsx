"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/cms/Editor";
import MediaUpload from "@/components/cms/MediaUpload";
import { createFacility, updateFacility } from "@/actions/cms";
import { Save, ArrowLeft, Loader2, Minus, Plus, Building2, MapPin, Compass, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useAdminUI } from "@/providers/AdminUIProvider";

interface FacilityFormProps {
  initialData?: any;
}

export default function FacilityForm({ initialData }: FacilityFormProps) {
  const router = useRouter();
  const { toast } = useAdminUI();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    category: initialData?.category || "lab",
    description: initialData?.description || "",
    image: initialData?.image || "",
    tourImage: initialData?.tourImage || "",
    capacity: initialData?.capacity || "",
    features: initialData?.features || [],
    tags: initialData?.tags || [],
    sceneId: initialData?.sceneId || "",
    isVirtualTour: initialData?.isVirtualTour ?? false,
    quantity: initialData?.quantity || 1,
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const action = initialData ? updateFacility(initialData.id, formData) : createFacility(formData);
    const result = await action;

    if (result.success) {
      toast({
        title: "Success",
        message: `Fasilitas berhasil ${initialData ? 'diperbarui' : 'dibuat'}.`,
        type: "success"
      });
      router.push("/admin/facilities");
      router.refresh();
    } else {
       toast({
        title: "Error",
        message: "Gagal menyimpan fasilitas: " + result.error,
        type: "error"
      });
      setLoading(false);
    }
  };

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  const updateFeature = (index: number, val: string) => {
    const newArr = [...formData.features];
    newArr[index] = val;
    setFormData({ ...formData, features: newArr });
  };
  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_: any, i: number) => i !== index) }));
  };

  const addTag = () => setFormData(prev => ({ ...prev, tags: [...prev.tags, ""] }));
  const updateTag = (index: number, val: string) => {
    const newArr = [...formData.tags];
    newArr[index] = val;
    setFormData({ ...formData, tags: newArr });
  };
  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_: any, i: number) => i !== index) }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in font-sans pb-40">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/facilities" 
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#F15A24] hover:border-orange-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? "Edit Fasilitas" : "Tambah Fasilitas"}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Configuration & Content
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-1">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Informasi Utama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Fasilitas</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-700"
                  placeholder="e.g. Lab Komputer 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-700"
                >
                  <option value="lab">Laboratorium</option>
                  <option value="kelas">Ruang Kelas</option>
                  <option value="umum">Umum</option>
                  <option value="olahraga">Olahraga</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Subtitle (untuk Tour)</label>
                <input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-700"
                  placeholder="e.g. Pintu masuk utama kampus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kapasitas</label>
                <input
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-700"
                  placeholder="e.g. 40 Kursi atau 100 Orang"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kuantitas (Jumlah)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-700"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase">Deskripsi Fasilitas</label>
               <div className="rounded-xl overflow-hidden border border-slate-100">
                  <Editor
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    placeholder="Jelaskan detail fasilitas..."
                  />
               </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Building2 size={16} className="text-orange-500" />
                   Fitur Utama
               </h3>
               <button type="button" onClick={addFeature} className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-[#F15A24] rounded-lg text-[10px] font-bold hover:bg-[#F15A24] hover:text-white transition-all">
                  <Plus size={14} /> Add Feature
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {formData.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 group border border-transparent hover:border-orange-100 transition-all">
                     <span className="text-[10px] font-black text-slate-300">#{(i+1).toString().padStart(2, '0')}</span>
                     <input
                       value={feature}
                       onChange={(e) => updateFeature(i, e.target.value)}
                       className="flex-1 bg-transparent border-none text-xs font-bold text-slate-700 outline-none"
                       placeholder="e.g. WiFi 6"
                     />
                     <button type="button" onClick={() => removeFeature(i)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={14} />
                     </button>
                  </div>
               ))}
               
               {formData.features.length === 0 && (
                  <div className="col-span-2 py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs">
                     Belum ada fitur. Klik Add Feature.
                  </div>
               )}
            </div>
          </section>

          {/* VIRTUAL TOUR SETTINGS */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Compass size={16} className="text-indigo-500" />
                   Virtual Tour 360° Settings
               </h3>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aktifkan Tour?</span>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isVirtualTour: !formData.isVirtualTour })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isVirtualTour ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isVirtualTour ? 'right-1' : 'left-1'}`} />
                  </button>
               </div>
            </div>

            {formData.isVirtualTour && (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scene ID (untuk URL 360)</label>
                    <input
                      required={formData.isVirtualTour}
                      value={formData.sceneId}
                      onChange={(e) => setFormData({ ...formData, sceneId: e.target.value })}
                      className="w-full px-4 py-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 font-mono text-sm"
                      placeholder="e.g. halaman-depan"
                    />
                    <p className="text-[9px] text-slate-400 font-medium italic">*Harus unik dan sesuai dengan mapping engine virtual tour.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order / Urutan Tampil</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tags Tour (Interactive Badges)</label>
                      <button type="button" onClick={addTag} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">+ Tambah Tag</button>
                   </div>
                   <div className="flex flex-wrap gap-3 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                      {formData.tags.map((tag: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-indigo-200 rounded-full px-4 py-2 hover:shadow-md transition-all">
                           <input
                             value={tag}
                             onChange={(e) => updateTag(i, e.target.value)}
                             className="bg-transparent border-none text-[10px] font-black text-indigo-700 w-24 outline-none"
                             placeholder="e.g. Area Publik"
                           />
                           <button type="button" onClick={() => removeTag(i)} className="text-indigo-300 hover:text-rose-500">
                              <X size={12} />
                           </button>
                        </div>
                      ))}
                      {formData.tags.length === 0 && (
                        <p className="text-[10px] text-indigo-400/60 font-medium italic">Belum ada tag untuk virtual tour.</p>
                      )}
                   </div>
                </div>

                <div className="p-6 bg-indigo-600 rounded-[2rem] text-white">
                   <MediaUpload 
                     label="360 Tour Image (Panoramik)" 
                     value={formData.tourImage} 
                     onChange={(url) => setFormData({ ...formData, tourImage: url })} 
                     bucket="tour-images"
                   />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
            {/* Identity Image */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                 <MediaUpload 
                   label="Main Display Image" 
                   value={formData.image} 
                   onChange={(url) => setFormData({ ...formData, image: url })} 
                   bucket="facilities"
                 />
            </div>

            {/* Sticky Save Button */}
            <div className="sticky top-24">
                <div className="bg-[#0F172A] p-6 rounded-[2rem] shadow-xl shadow-slate-900/10 space-y-4 text-white overflow-hidden relative group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="text-xs font-medium text-slate-400 mb-4">Ready to save?</div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${initialData ? 'bg-emerald-600' : 'bg-[#F15A24]'} hover:opacity-90 disabled:bg-slate-700 text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Saving..." : initialData ? "Ubah Fasilitas" : "Simpan Fasilitas"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </form>
    </div>
  );
}
