"use server";

import { prisma, db } from "@/lib/prisma";
import { Prisma } from "@/generated/client_v2";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin, checkRole } from "@/lib/auth-utils";
import { createAuditLog } from "@/lib/audit";

// NEWS ACTIONS
export async function getNews() {       
  try {
    return await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNewsById(id: string) {
  try {
    return await prisma.news.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }
}

export async function createNews(data: {
  title: string;
  slug: string;
  content: string;
  image?: string;
  published?: boolean;
}) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);
    
    const news = await prisma.news.create({
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entity: "News",
      entityId: news.id,
      details: { title: news.title }
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
    return { success: true, data: news };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error creating news:", error);
    return { success: false, error: error.message || "Gagal membuat berita" };
  }
}

export async function updateNews(
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    image?: string;
    published?: boolean;
  }
) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);

    const news = await prisma.news.update({
      where: { id },
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entity: "News",
      entityId: news.id,
      details: { title: news.title }
    });

    revalidatePath("/news");
    revalidatePath(`/news/${id}`);
    revalidatePath("/admin/news");
    return { success: true, data: news };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error updating news:", error);
    return { success: false, error: error.message || "Gagal memperbarui berita" };
  }
}

export async function deleteNews(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);

    await prisma.news.delete({
      where: { id },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entity: "News",
      entityId: id
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting news:", error);
    return { success: false, error: error.message || "Gagal menghapus berita" };
  }
}

// PROGRAM ACTIONS
interface ProgramInput {
  title: string;
  slug: string;
  degree: string;
  subtitle: string;
  description: string;
  longDescription: string;
  heroImage: string;
  color?: string;
  competencies: any; // Relaxed type for array of objects
  careers: any; // Relaxed type
  tools: any; // Relaxed type
  stats: any; // Relaxed type
}

export async function getPrograms() {
  try {
    return await prisma.program.findMany({
      orderBy: { degree: "asc" },
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export async function getProgramById(id: string) {
  try {
    return await prisma.program.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

export async function createProgram(data: ProgramInput) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "ACADEMIC_ADMIN"]);
    
    const program = await prisma.program.create({
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entity: "Program",
      entityId: program.id,
      details: { title: program.title }
    });

    revalidatePath("/(site)/program", "layout");
    revalidatePath("/admin/programs");
    return { success: true, data: program };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error creating program:", error);
    return { success: false, error: error.message || "Gagal membuat program studi" };
  }
}

export async function updateProgram(id: string, data: Partial<ProgramInput>) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "ACADEMIC_ADMIN"]);
    
    const program = await prisma.program.update({
      where: { id },
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entity: "Program",
      entityId: program.id,
      details: { title: program.title }
    });

    revalidatePath("/(site)/program", "layout");
    revalidatePath("/admin/programs");
    return { success: true, data: program };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error updating program:", error);
    return { success: false, error: error.message || "Gagal memperbarui program studi" };
  }
}

export async function deleteProgram(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "ACADEMIC_ADMIN"]);
    
    await prisma.program.delete({
      where: { id },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entity: "Program",
      entityId: id
    });

    revalidatePath("/(site)/program", "layout");
    revalidatePath("/admin/programs");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting program:", error);
    return { success: false, error: error.message || "Gagal menghapus program studi" };
  }
}

// ANALYTICS ACTIONS
export async function trackVisitor() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stat = await prisma.dailyStat.upsert({
      where: { date: today },
      update: { pageViews: { increment: 1 } },
      create: { date: today, pageViews: 1, visitors: 1 },
    });
    return { success: true, data: stat };
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return { success: false };
  }
}


// GALLERY ACTIONS
export async function getGallery() {
  try {
    return await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

export async function createGallery(data: {
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  categoryIcon?: string;
}) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);

    const item = await prisma.gallery.create({
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entity: "Gallery",
      entityId: item.id,
      details: { title: item.title }
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, data: item };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error creating gallery:", error);
    return { success: false, error: error.message || "Gagal menambah galeri" };
  }
}

export async function deleteGallery(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);

    await prisma.gallery.delete({
      where: { id },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entity: "Gallery",
      entityId: id
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting gallery:", error);
    return { success: false, error: error.message || "Gagal menghapus galeri" };
  }
}

// ADMIN PROFILE
export async function getAdminProfile() {
  try {
    const admin = await getCurrentAdmin();
    return admin;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
}

// INBOX ACTIONS
export async function markMessageAsRead(id: string) {
  try {
    await checkRole(["SUPER_ADMIN"]);
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false, error: "Gagal memperbarui status pesan" };
  }
}

export async function deleteMessage(id: string) {
  try {
    await checkRole(["SUPER_ADMIN"]);
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Gagal menghapus pesan" };
  }
}

export async function clearMessages() {
  try {
    await checkRole(["SUPER_ADMIN"]);
    await prisma.contactMessage.deleteMany({});
    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Error clearing messages:", error);
    return { success: false, error: "Gagal membersihkan kotak masuk" };
  }
}

export async function getUnreadMessagesCount() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return 0;
    
    return await prisma.contactMessage.count({
      where: { isRead: false }
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

import { createClient as createServerClient } from "@/lib/supabase-server";

export async function changeAdminPassword(data: { oldPassword: string, newPassword: string }) {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR", "ACADEMIC_ADMIN"]);
    const supabase = await createServerClient();

    // Verify old password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: data.oldPassword
    });

    if (signInError) {
      throw new Error("Password lama salah");
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entity: "Admin",
      entityId: admin.id,
      details: { action: "CHANGE_PASSWORD" }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error changing password:", err);
    return { success: false, error: err.message || "Gagal mengganti password" };
  }
}

// FAQ ACTIONS
export async function getFaqs() {
  try {
    // @ts-ignore - Prisma type sync issue on Windows
    return await prisma.faq.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function createFaq(data: {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    // @ts-ignore - Prisma type sync issue on Windows
    const faq = await prisma.faq.create({
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entity: "FAQ",
      entityId: faq.id,
      details: { question: faq.question }
    });

    revalidatePath("/admin/faq");
    revalidatePath("/"); // Revalidate home for FAQ section
    return { success: true, data: faq };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error creating FAQ:", error);
    return { success: false, error: error.message || "Gagal membuat FAQ" };
  }
}

export async function updateFaq(id: string, data: Partial<{
  question: string;
  answer: string;
  category: string;
  order: number;
}>) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    // @ts-ignore - Prisma type sync issue on Windows
    const faq = await prisma.faq.update({
      where: { id },
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entity: "FAQ",
      entityId: id,
      details: { question: faq.question }
    });

    revalidatePath("/admin/faq");
    revalidatePath("/");
    return { success: true, data: faq };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error updating FAQ:", error);
    return { success: false, error: error.message || "Gagal memperbarui FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    // @ts-ignore - Prisma type sync issue on Windows
    await prisma.faq.delete({
      where: { id },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entity: "FAQ",
      entityId: id
    });

    revalidatePath("/admin/faq");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting FAQ:", error);
    return { success: false, error: error.message || "Gagal menghapus FAQ" };
  }
}
// NAVIGATION ACTIONS
export async function getNavigations() {
  try {
    // @ts-ignore
    return await prisma.navigation.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching navigations:", error);
    return [];
  }
}

export async function createNavigation(data: any) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    // @ts-ignore
    const nav = await prisma.navigation.create({
      data,
    });

    revalidatePath("/", "layout");
    return { success: true, data: nav };
  } catch (err: any) {
    console.error("Error creating navigation:", err);
    return { success: false, error: err.message };
  }
}

export async function updateNavigation(id: string, data: any) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    // @ts-ignore
    const nav = await prisma.navigation.update({
      where: { id },
      data,
    });

    revalidatePath("/", "layout");
    return { success: true, data: nav };
  } catch (err: any) {
    console.error("Error updating navigation:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteNavigation(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    // @ts-ignore
    await prisma.navigation.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting navigation:", err);
    return { success: false, error: err.message };
  }
}

// SEO ACTIONS
export async function getSeoSettings() {
  try {
    const admin = await checkRole(["SUPER_ADMIN", "NEWS_EDITOR"]);
    // @ts-ignore
    return await db.seoSetting.findMany({
      orderBy: { path: "asc" },
    });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return [];
  }
}

export async function upsertSeoSetting(data: any) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    // @ts-ignore
    const seo = await db.seoSetting.upsert({
      where: { path: data.path },
      update: {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        image: data.image
      },
      create: {
        path: data.path,
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        image: data.image
      },
    });

    revalidatePath("/", "layout");
    return { success: true, data: seo };
  } catch (err: any) {
    console.error("Error upserting SEO setting:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteSeoSetting(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    // @ts-ignore
    await db.seoSetting.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting SEO setting:", err);
    return { success: false, error: err.message };
  }
}

// AUDIT LOG ACTIONS
export async function getAuditLogs() {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    return await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: { name: true, email: true }
        }
      },
      take: 100, // Limit to recent 100
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}

// GENERAL SETTINGS ACTIONS
export async function getGeneralSettings() {
  try {
    const settings = await db.setting.findMany();
    // Transform to key-value object
    return settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching general settings:", error);
    return {};
  }
}

export async function updateGeneralSettings(data: Record<string, string>) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    // Process all keys
    const promises = Object.entries(data).map(([key, value]) => {
      return db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(promises);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating general settings:", err);
    return { success: false, error: err.message };
  }
}

// FACILITY ACTIONS
export async function getFacilities() {
  try {
    return await prisma.facility.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function getFacilityById(id: string) {
  try {
    return await prisma.facility.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching facility by id:", error);
    return null;
  }
}

export async function createFacility(data: any) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    const facility = await prisma.facility.create({
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entity: "Facility",
      entityId: facility.id,
      details: { title: facility.title }
    });

    revalidatePath("/facility");
    revalidatePath("/facility-tour");
    revalidatePath("/admin/facilities");
    return { success: true, data: facility };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error creating facility:", error);
    return { success: false, error: error.message || "Gagal membuat fasilitas" };
  }
}

export async function updateFacility(id: string, data: any) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    const facility = await prisma.facility.update({
      where: { id },
      data,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entity: "Facility",
      entityId: facility.id,
      details: { title: facility.title }
    });

    revalidatePath("/facility");
    revalidatePath("/facility-tour");
    revalidatePath("/admin/facilities");
    return { success: true, data: facility };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error updating facility:", error);
    return { success: false, error: error.message || "Gagal memperbarui fasilitas" };
  }
}

export async function deleteFacility(id: string) {
  try {
    const admin = await checkRole(["SUPER_ADMIN"]);
    
    await prisma.facility.delete({
      where: { id },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entity: "Facility",
      entityId: id
    });

    revalidatePath("/facility");
    revalidatePath("/facility-tour");
    revalidatePath("/admin/facilities");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting facility:", error);
    return { success: false, error: error.message || "Gagal menghapus fasilitas" };
  }
}
