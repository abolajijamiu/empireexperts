import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agency = await prisma.agency.findUnique({
    where: { userId: session.user.id },
    include: { categories: true },
  });

  return NextResponse.json(agency);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { categories: categoriesRaw, ...rest } = data;

  const agency = await prisma.agency.findUnique({ where: { userId: session.user.id } });
  if (!agency) return NextResponse.json({ error: "Agency not found" }, { status: 404 });

  const categoryNames: string[] = categoriesRaw
    ? categoriesRaw.split(",").map((c: string) => c.trim()).filter(Boolean)
    : [];

  await prisma.$transaction([
    prisma.agencyCategory.deleteMany({ where: { agencyId: agency.id } }),
    prisma.agency.update({
      where: { id: agency.id },
      data: {
        ...rest,
        categories: {
          create: categoryNames.map((name) => ({ name })),
        },
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
