"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube, 
  Globe, 
  Phone,
  Loader2,
  Info,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { getGeneralSettings, updateGeneralSettings } from "@/actions/cms";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { motion } from "framer-motion";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    whatsapp: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    youtube: "",
    phone: "",
    campus_name: "Politeknik Prestasi Prima",
    website_url: ""
  });

  const { toast } = useAdminUI();

  useEffect(() => {
    async function loadSettings() {
      const data = await getGeneralSettings();
      if (Object.keys(data).length > 0) {
        setFormData(prev => ({ ...prev, ...data }));
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await updateGeneralSettings(formData);
      if (result.success) {
        toast({ 
          title: "Settings Updated", 
          message: "Konfigurasi instansi berhasil diperbarui.", 
          type: "success" 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
         <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20">
      <div className="mb-10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
               <Settings size={28} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">General Settings</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola informasi publik instansi Anda</p>
            </div>
         </div>
         
         <button 
           onClick={handleSubmit}
           disabled={submitting}
           className="flex items-center gap-3 bg-[#0F172A] hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
         >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>Simpan Perubahan</span>
         </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
         {/* Contact Section */}
         <section className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <h4 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-widest">
               <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Phone size={16} />
               </div>
               Kontak Utama & Alamat
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <MessageCircle size={12} /> WhatsApp Business
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="628123456789"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
                  <p className="text-[9px] font-bold text-slate-300 px-2">Gunakan format 62 tanpa tanda + atau spasi.</p>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <Mail size={12} /> Email Institusi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@poltekprestasi.ac.id"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
               </div>

               <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <MapPin size={12} /> Alamat Kampus
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jl. Raya Jakarta No. 123, Jakarta Timur..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner resize-none"
                  />
               </div>
            </div>
         </section>

         {/* Social Media Section */}
         <section className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <h4 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-widest">
               <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Globe size={16} />
               </div>
               Media Sosial
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <Instagram size={12} /> Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@poltekprestasi"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <Facebook size={12} /> Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <Youtube size={12} /> YouTube Channel
                  </label>
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 ring-0 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
               </div>
            </div>
         </section>

         {/* Info Card */}
         <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 flex items-start gap-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0">
               <ShieldCheck size={24} />
            </div>
            <div>
               <h5 className="font-black text-lg leading-tight">Sinkronisasi Global Aktif</h5>
               <p className="text-indigo-100 text-xs mt-2 font-medium leading-relaxed">
                  Semua perubahan yang Anda simpan di sini akan langsung memperbarui info kontak di <strong>Footer</strong>, <strong>Header</strong>, dan <strong>Halaman Kontak</strong> di seluruh website secara otomatis.
               </p>
            </div>
         </div>
      </form>
    </div>
  );
}
