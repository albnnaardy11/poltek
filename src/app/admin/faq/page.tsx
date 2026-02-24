"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Tag,
  Hash,
  Search
} from "lucide-react";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/actions/cms";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default function FaqAdminPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Umum",
    order: 0
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { confirm, toast } = useAdminUI();

  const fetchFaqs = useCallback(async () => {
    const data = await getFaqs();
    setFaqs(data as FaqItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingId) {
        const result = await updateFaq(editingId, formData);
        if (result.success) {
          toast({ title: "Updated", message: "FAQ berhasil diperbarui.", type: "success" });
          setEditingId(null);
        } else {
          throw new Error(result.error as string);
        }
      } else {
        const result = await createFaq(formData);
        if (result.success) {
          toast({ title: "Success", message: "FAQ berhasil ditambahkan.", type: "success" });
        } else {
          throw new Error(result.error as string);
        }
      }
      
      setFormData({ question: "", answer: "", category: "Umum", order: 0 });
      fetchFaqs();
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Hapus FAQ?",
      description: "Pertanyaan ini akan dihapus permanen dari website.",
      type: "danger",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        const result = await deleteFaq(id);
        if (result.success) {
          fetchFaqs();
          toast({ title: "Deleted", message: "FAQ berhasil dihapus.", type: "success" });
        } else {
          toast({ title: "Error", message: "Gagal menghapus FAQ", type: "error" });
        }
      }
    });
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIndex, startIndex + itemsPerPage);

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${editingId ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {editingId ? <Edit size={22} /> : <Plus size={22} strokeWidth={3} />}
              </div>
              {editingId ? "Edit FAQ" : "Tambah FAQ Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={14} /> Pertanyaan
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Apa syarat pendaftaran mahasiswa baru?"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Jawaban
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Syarat pendaftaran adalah..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Kategori
                  </label>
                  <input
                    required
                    type="text"
                    list="faq-categories"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Misal: Biaya"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
                  <datalist id="faq-categories">
                    <option value="Umum" />
                    <option value="Pendaftaran" />
                    <option value="Biaya" />
                    <option value="Beasiswa" />
                    <option value="Fasilitas" />
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Hash size={14} /> Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-400 ${
                    editingId 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                    : 'bg-[#0F172A] hover:bg-indigo-600 text-white shadow-slate-200'
                  }`}
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : (editingId ? "Update FAQ" : "Simpan FAQ")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ question: "", answer: "", category: "Umum", order: 0 });
                    }}
                    className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Database FAQ</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredFaqs.length} Filtered FAQs</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Items Per Page Filter */}
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="relative group min-w-[200px] md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari FAQ..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-500/30 transition-all font-bold text-slate-700 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 animate-pulse h-32 rounded-[2.5rem]" />
              ))
            ) : paginatedFaqs.length > 0 ? (
              <>
                {paginatedFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-full -translate-y-10 translate-x-10 -z-10" />
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {faq.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Order: {faq.order}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{faq.question}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{faq.answer}</p>
                      </div>

                      <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(faq)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-100 rounded-xl transition-all shadow-sm active:scale-95"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(faq.id)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-95"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all disabled:opacity-30 disabled:hover:border-slate-100 shadow-sm active:scale-95"
                    >
                      <ChevronUp className="-rotate-90" size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-12 h-12 rounded-2xl font-black text-xs transition-all active:scale-90 ${
                            currentPage === i + 1
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white border border-slate-100 text-slate-400 hover:border-indigo-100 hover:text-indigo-600 shadow-sm'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all disabled:opacity-30 disabled:hover:border-slate-100 shadow-sm active:scale-95"
                    >
                      <ChevronDown className="-rotate-90" size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center gap-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                    <HelpCircle size={32} />
                 </div>
                 <div>
                    <p className="text-slate-400 font-black text-sm uppercase tracking-widest">FAQ Tidak Ditemukan</p>
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-tight mt-1">Gunakan form untuk menambah atau kurangi filter pencarian.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
