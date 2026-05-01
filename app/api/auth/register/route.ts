import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const { name, email, password, agencyName } = await req.json();

  if (!name || !email || !password || !agencyName) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const baseSlug = slugify(agencyName);
  let slug = baseSlug;
  let attempt = 0;

  while (await prisma.agency.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      agency: {
        create: {
          name: agencyName,
          slug,
        },
      },
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
