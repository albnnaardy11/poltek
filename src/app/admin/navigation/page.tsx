"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Link as LinkIcon,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layout
} from "lucide-react";
import { getNavigations, createNavigation, updateNavigation, deleteNavigation } from "@/actions/cms";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationItem {
  id: string;
  title: string;
  url: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  type: string;
}

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    parentId: "",
    order: 0,
    isActive: true,
    type: "HEADER"
  });

  const { confirm, toast } = useAdminUI();

  const fetchItems = useCallback(async () => {
    const data = await getNavigations();
    setItems(data as NavigationItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        url: formData.url || null,
        parentId: formData.parentId || null,
        order: Number(formData.order)
      };

      if (editingId) {
        const result = await updateNavigation(editingId, payload);
        if (result.success) {
          toast({ title: "Updated", message: "Navigasi berhasil diperbarui.", type: "success" });
          setEditingId(null);
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await createNavigation(payload);
        if (result.success) {
          toast({ title: "Success", message: "Navigasi berhasil ditambahkan.", type: "success" });
        } else {
          throw new Error(result.error);
        }
      }
      
      setFormData({ title: "", url: "", parentId: "", order: 0, isActive: true, type: "HEADER" });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      url: item.url || "",
      parentId: item.parentId || "",
      order: item.order,
      isActive: item.isActive,
      type: item.type
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Hapus Navigasi?",
      description: "Menghapus item menu juga mungkin berdampak pada sub-menu di bawahnya.",
      type: "danger",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        const result = await deleteNavigation(id);
        if (result.success) {
          fetchItems();
          toast({ title: "Deleted", message: "Item navigasi berhasil dihapus.", type: "success" });
        } else {
          toast({ title: "Error", message: "Gagal menghapus navigasi", type: "error" });
        }
      }
    });
  };

  const toggleStatus = async (item: NavigationItem) => {
    const result = await updateNavigation(item.id, { isActive: !item.isActive });
    if (result.success) {
      fetchItems();
      toast({ title: "Status Updated", message: `Menu ${item.title} ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" });
    }
  };

  const rootItems = items.filter(i => !i.parentId);
  
  const renderNavRows = (parentId: string | null = null, depth = 0) => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => (
        <React.Fragment key={item.id}>
          <tr className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${!item.isActive ? 'opacity-60' : ''}`}>
            <td className="py-4 pl-6">
              <div className="flex items-center gap-3">
                {depth > 0 && (
                  <div className="flex items-center">
                    {Array.from({ length: depth }).map((_, i) => (
                      <div key={i} className="w-6 h-6 border-l-2 border-slate-100 ml-2" />
                    ))}
                    <div className="w-4 h-[2px] bg-slate-100" />
                  </div>
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${depth === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                  {depth === 0 ? <Layout size={16} /> : <LinkIcon size={14} />}
                </div>
                <span className={`text-sm font-bold ${depth === 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                  {item.title}
                </span>
              </div>
            </td>
            <td className="py-4 px-4 text-xs font-medium text-slate-400 font-mono">
              {item.url || "-"}
            </td>
            <td className="py-4 px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
            </td>
            <td className="py-4 px-4 text-center">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black">{item.order}</span>
            </td>
            <td className="py-4 px-4 text-center">
              <button 
                onClick={() => toggleStatus(item)}
                className={`w-10 h-6 rounded-full transition-all relative ${item.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.isActive ? 'right-1' : 'left-1'}`} />
              </button>
            </td>
            <td className="py-4 pr-6 text-right">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
          {renderNavRows(item.id, depth + 1)}
        </React.Fragment>
      ));
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${editingId ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {editingId ? <Edit size={22} /> : <Plus size={22} strokeWidth={3} />}
              </div>
              {editingId ? "Edit Menu" : "Tambah Menu Utama"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Label Menu</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Tentang Kami"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">URL / Link</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/about atau #header"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Induk Menu (Parent)</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 outline-none transition-all font-bold text-slate-700 shadow-inner appearance-none"
                >
                  <option value="">Status: Root (Utama)</option>
                  {items.filter(i => i.id !== editingId).map(item => (
                    <option key={item.id} value={item.id}>Induk: {item.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent outline-none transition-all font-bold text-slate-700 shadow-inner"
                  >
                    <option value="HEADER">HEADER</option>
                    <option value="FOOTER">FOOTER</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Urutan</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                    editingId 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                    : 'bg-[#0F172A] hover:bg-indigo-600 text-white shadow-slate-200'
                  }`}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? "Update Menu" : "Tambah Item")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: "", url: "", parentId: "", order: 0, isActive: true, type: "HEADER" });
                    }}
                    className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Struktur Navigasi</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atur susunan menu header & footer</p>
                </div>
              </div>
              <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl flex items-center gap-2">
                 <Layout size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{items.length} Total Items</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="py-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Label Menu</th>
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Link</th>
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe</th>
                    <th className="py-4 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                    <th className="py-4 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 pr-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 size={32} className="text-indigo-600 animate-spin" />
                          <p className="text-xs font-bold text-slate-400 uppercase">Synchronizing...</p>
                        </div>
                      </td>
                    </tr>
                  ) : items.length > 0 ? (
                    renderNavRows()
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                         <div className="flex flex-col items-center gap-4">
                            <Layers size={48} className="text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm">Tidak ada menu ditemukan. Mulai buat sekarang.</p>
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

import React from "react";
