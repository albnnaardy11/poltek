"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  Search as SearchIcon, 
  Globe,
  Tag,
  AlignLeft,
  Layout,
  ExternalLink,
  Save,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { getSeoSettings, upsertSeoSetting, deleteSeoSetting } from "@/actions/cms";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { motion, AnimatePresence } from "framer-motion";

interface SeoSetting {
  id: string;
  path: string;
  title: string;
  description: string | null;
  keywords: string | null;
  image: string | null;
  updatedAt: Date;
}

export default function SeoAdminPage() {
  const [items, setItems] = useState<SeoSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    path: "",
    title: "",
    description: "",
    keywords: "",
    image: ""
  });

  const { confirm, toast } = useAdminUI();

  const fetchItems = useCallback(async () => {
    const data = await getSeoSettings();
    setItems(data as SeoSetting[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await upsertSeoSetting(formData);
      if (result.success) {
        toast({ title: "Optimized", message: "Metadata SEO berhasil disimpan.", type: "success" });
        setFormData({ path: "", title: "", description: "", keywords: "", image: "" });
        setEditingPath(null);
        fetchItems();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: SeoSetting) => {
    setEditingPath(item.path);
    setFormData({
      path: item.path,
      title: item.title,
      description: item.description || "",
      keywords: item.keywords || "",
      image: item.image || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Hapus SEO Config?",
      description: "Halaman ini akan kembali menggunakan metadata default jika dihapus.",
      type: "danger",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        const result = await deleteSeoSetting(id);
        if (result.success) {
          fetchItems();
          toast({ title: "Reset", message: "Config SEO berhasil dihapus.", type: "success" });
        } else {
          toast({ title: "Error", message: "Gagal menghapus SEO", type: "error" });
        }
      }
    });
  };

  const filteredItems = items.filter(i => 
    i.path.toLowerCase().includes(search.toLowerCase()) || 
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Editor Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
             
             <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10">
                <div className={`p-3 rounded-2xl ${editingPath ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                   {editingPath ? <Edit size={22} /> : <Zap size={22} fill="currentColor" />}
                </div>
                {editingPath ? "Edit SEO Page" : "Optimasi Halaman Baru"}
             </h3>

             <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <Globe size={12} /> Target Path (Slug)
                   </label>
                   <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">/</span>
                      <input
                        required
                        disabled={!!editingPath}
                        type="text"
                        value={formData.path.startsWith("/") ? formData.path.substring(1) : formData.path}
                        onChange={(e) => setFormData({ ...formData, path: "/" + e.target.value.replace(/^\//, '') })}
                        placeholder="about-us"
                        className="w-full pl-8 pr-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner disabled:opacity-50"
                      />
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 px-2 uppercase">Gunakan / untuk beranda, atau path unik halaman.</p>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <Tag size={12} /> Meta Title (SEO Title)
                   </label>
                   <input
                     required
                     type="text"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     placeholder="Contoh: Profil Kampus | Politeknik Prestasi Prima"
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                   />
                   <div className="flex justify-between px-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Rekomendasi: 50-60 Karakter</span>
                      <span className={`text-[9px] font-black uppercase ${formData.title.length > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>{formData.title.length}</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <AlignLeft size={12} /> Meta Description
                   </label>
                   <textarea
                     rows={4}
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     placeholder="Jelaskan isi halaman ini secara singkat untuk mesin pencari..."
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner resize-none"
                   />
                   <div className="flex justify-between px-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Rekomendasi: 150-160 Karakter</span>
                      <span className={`text-[9px] font-black uppercase ${formData.description.length > 160 ? 'text-rose-500' : 'text-emerald-500'}`}>{formData.description.length}</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <Layout size={12} /> Keywords (Pisahkan dengan koma)
                   </label>
                   <input
                     type="text"
                     value={formData.keywords}
                     onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                     placeholder="politeknik, vokasi, jakarta timur, pendaftaran"
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                   />
                </div>

                <div className="flex gap-4 pt-4">
                   <button
                     disabled={submitting}
                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                       editingPath ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-[#0F172A] hover:bg-indigo-600 text-white shadow-slate-200'
                     }`}
                   >
                     {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingPath ? "Update SEO" : "Aktifkan SEO")}
                   </button>
                   {editingPath && (
                     <button
                       type="button"
                       onClick={() => {
                         setEditingPath(null);
                         setFormData({ path: "", title: "", description: "", keywords: "", image: "" });
                       }}
                       className="px-8 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                     >
                        Batal
                     </button>
                   )}
                </div>
             </form>
          </div>

          <div className="mt-8 p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex items-start gap-4">
             <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={20} />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest leading-none mt-1">SEO Engine Status: Online</h4>
                <p className="text-[10px] font-bold text-emerald-600/70 mt-2 leading-relaxed">System secara otomatis menyuntikkan (inject) metadata ini ke halaman publik sesuai dengan URL Path yang didaftarkan.</p>
             </div>
          </div>
        </div>

        {/* Status Table */}
        <div className="lg:col-span-7">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Meta Manager</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daftar halaman yang ter-optimasi</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                   <SearchIcon size={16} className="text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Cari Path..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 w-32 focus:w-48 transition-all placeholder:text-slate-300"
                   />
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                 <table className="w-full text-left min-w-[800px] lg:min-w-0">
                    <thead className="bg-slate-50/50">
                       <tr>
                          <th className="py-5 pl-8 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Path</th>
                          <th className="py-5 px-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Title</th>
                          <th className="py-5 px-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="py-5 pr-8 text-right text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {loading ? (
                         <tr>
                           <td colSpan={4} className="py-20 text-center">
                              <Loader2 className="animate-spin text-indigo-500 mx-auto" size={32} />
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Indexing Meta...</p>
                           </td>
                         </tr>
                       ) : filteredItems.length > 0 ? (
                         filteredItems.map(item => (
                           <tr key={item.id} className="group hover:bg-slate-50/30 transition-all">
                              <td className="py-6 pl-8">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold">
                                       /
                                    </div>
                                    <span className="text-sm font-bold text-slate-800 font-mono tracking-tight">{item.path}</span>
                                 </div>
                              </td>
                              <td className="py-6 px-4">
                                 <div className="flex flex-col max-w-[250px]">
                                    <span className="text-sm font-black text-slate-700 truncate">{item.title}</span>
                                    {item.description && (
                                      <span className="text-[10px] font-medium text-slate-400 line-clamp-1 italic mt-1">{item.description}</span>
                                    )}
                                 </div>
                              </td>
                              <td className="py-6 px-4 text-center">
                                 <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Optimized
                                 </span>
                              </td>
                              <td className="py-6 pr-8 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                      href={item.path} 
                                      target="_blank"
                                      className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors"
                                      title="View Live"
                                    >
                                       <ExternalLink size={16} />
                                    </Link>
                                    <button 
                                       onClick={() => handleEdit(item)}
                                       className="p-2.5 text-slate-400 hover:text-amber-500 transition-colors"
                                       title="Edit SEO"
                                    >
                                       <Edit size={16} />
                                    </button>
                                    <button 
                                       onClick={() => handleDelete(item.id)}
                                       className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"
                                       title="Remove SEO"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                            <td colSpan={4} className="py-24 text-center">
                               <div className="max-w-[280px] mx-auto space-y-4">
                                  <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-slate-200">
                                     <Globe size={32} />
                                  </div>
                                  <p className="text-sm font-bold text-slate-400">Belum ada halaman yang dioptimasi secara spesifik. Mulai tambahkan SEO Metadata untuk halaman penting Anda.</p>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
