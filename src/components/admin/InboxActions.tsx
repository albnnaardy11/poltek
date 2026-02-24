"use client";

import React, { useState } from "react";
import { markMessageAsRead, deleteMessage, clearMessages } from "@/actions/cms";
import { CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useAdminUI } from "@/providers/AdminUIProvider";

export function MessageActions({ id, isRead }: { id: string, isRead: boolean }) {
  const { confirm, toast } = useAdminUI();
  const [loading, setLoading] = useState<"read" | "delete" | null>(null);

  const onMarkRead = async () => {
    setLoading("read");
    const result = await markMessageAsRead(id);
    if (result.success) {
      toast({ title: "Success", message: "Pesan ditandai sudah dibaca", type: "success" });
    }
    setLoading(null);
  };

  const onDelete = async () => {
    confirm({
      title: "Hapus Pesan?",
      description: "Tindakan ini tidak dapat dibatalkan.",
      type: "danger",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        setLoading("delete");
        const result = await deleteMessage(id);
        if (result.success) {
          toast({ title: "Deleted", message: "Pesan berhasil dihapus", type: "success" });
        }
        setLoading(null);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {!isRead && (
        <button 
          onClick={onMarkRead}
          disabled={!!loading}
          className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          title="Tandai sudah dibaca"
        >
          {loading === "read" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        </button>
      )}
      <button 
        onClick={onDelete}
        disabled={!!loading}
        className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        title="Hapus pesan"
      >
        {loading === "delete" ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}

export function ClearInboxButton() {
  const { confirm, toast } = useAdminUI();
  const [loading, setLoading] = useState(false);

  const onClear = async () => {
    confirm({
      title: "Bersihkan Semua Pesan?",
      description: "Ini akan menghapus seluruh isi kotak masuk secara permanen.",
      type: "danger",
      confirmLabel: "Hapus Semua",
      onConfirm: async () => {
        setLoading(true);
        const result = await clearMessages();
        if (result.success) {
          toast({ title: "Success", message: "Kotak masuk dikosongkan", type: "success" });
        }
        setLoading(false);
      }
    });
  };

  return (
    <button 
      onClick={onClear}
      disabled={loading}
      className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="text-rose-500" />}
      <span>Bersihkan Pesan</span>
    </button>
  );
}
