"use server";

import { prisma } from "@/lib/prisma";
import { sendAutoReply, sendAdminNotification } from "@/lib/mail";

export async function getProgramBySlug(slug: string) {
  try {
    const program = await prisma.program.findUnique({
      where: { slug },
    });
    return program;
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

export async function getAllProgramsMenu() {
  try {
    const programs = await prisma.program.findMany({
      select: {
        title: true,
        slug: true,
        degree: true,
      },
      orderBy: {
        title: 'asc',
      }
    });

    // Group by degree for menu structure
    const grouped = {
      D3: programs.filter(p => p.degree === 'D3'),
      D4: programs.filter(p => p.degree === 'D4'),
      S1: programs.filter(p => p.degree === 'S1'),
    };

    return grouped;
  } catch (error) {
    console.error("Error fetching programs menu:", error);
    return { D3: [], D4: [], S1: [] };
  }
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  subject?: string;
  message: string;
}) {
  try {
    // @ts-ignore - Prisma client needs generation for new phone/category fields
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        // @ts-ignore
        phone: data.phone,
        // @ts-ignore
        category: data.category,
        subject: data.subject || "No Subject",
        message: data.message,
      },
    });

    // Send emails asynchronously (don't block the return, but await them to ensure they process within the request lifecycle if needed, or fire and forget. 
    // Vercel Serverless allows a bit of execution after response, but awaiting is safer).
    await Promise.all([
      sendAutoReply(data.name, data.email),
      sendAdminNotification({
        name: data.name,
        email: data.email,
        category: data.category || "Pertanyaan",
        subject: data.subject || "No Subject",
        message: data.message
      })
    ]);

    return { success: true, data: contactMessage };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Gagal mengirim pesan. Silakan coba lagi nanti." };
  }
}

export async function getLatestNews(limit: number = 6) {
  try {
    const newsDetails = await prisma.news.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const formattedNews = newsDetails.map((item) => { 
        const date = new Date(item.createdAt);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('id-ID', { month: 'short' });
        const year = date.getFullYear();

        // Extract category from metaTitle (format: "Category | Title" or just "Category")
        // If no separator, use "Berita"
        let category = "Berita";
        if (item.metaTitle && item.metaTitle.includes("|")) {
            category = item.metaTitle.split("|")[0].trim();
        } else if (item.metaTitle) {
             // If metaTitle is short (like one word), maybe it's the category? 
             // But usually metaTitle is the page title. 
             // Let's stick to the separator convention for now.
             // Or, I can check against known categories? No.
             // I'll just default to "Berita" if no pipe.
        }

        return {
            id: item.id,
            category: category,
            title: item.title,
            img: item.image || "/images/sections/news/newsdummy.jpeg",
            date: `${day} ${month} ${year}`,
            excerpt: item.metaDesc || item.content.substring(0, 100) + "...",
            link: `/news/${item.slug}`,
        };
    });
    
    return formattedNews;

  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    // Try finding by slug first
    let news = await prisma.news.findUnique({
      where: { slug },
    });
    
    // Fallback to ID if not found
    if (!news) {
      news = await prisma.news.findUnique({
        where: { id: slug },
      });
    }

    return news;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }
}

export async function getPublicSettings() {
  try {
    const settings = await prisma.setting.findMany();
    return settings.reduce((acc: Record<string, string>, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting settings:", error);
    return {};
  }
}
