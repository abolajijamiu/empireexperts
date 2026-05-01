import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agency = await prisma.agency.findUnique({ where: { userId: session.user.id } });
  if (!agency) return NextResponse.json([]);

  const services = await prisma.service.findMany({
    where: { agencyId: agency.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agency = await prisma.agency.findUnique({ where: { userId: session.user.id } });
  if (!agency) return NextResponse.json({ error: "Agency not found" }, { status: 404 });

  const data = await req.json();

  const service = await prisma.service.create({
    data: {
      agencyId: agency.id,
      title: data.title,
      description: data.description || null,
      price: data.price || null,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
