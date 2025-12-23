import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shortUrl = await db.shortUrl.findUnique({
    where: { slug },
  });

  if (!shortUrl) {
    notFound();
  }

  // Increment click count (fire and forget, or await?)
  // Better to await to ensure accurate counting before redirect
  await db.shortUrl.update({
    where: { id: shortUrl.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(shortUrl.originalUrl);
}
