import { db } from "./src/lib/prisma";
const r = await db.facility.findMany({ where: { isVirtualTour: true }, orderBy: { order: "asc" }, select: { id: true, title: true, subtitle: true, sceneId: true } });
r.forEach((x: any) => console.log(x.title, "||", x.subtitle ?? "NO_SUBTITLE", "| scene:", x.sceneId));
await db.$disconnect();
process.exit(0);
