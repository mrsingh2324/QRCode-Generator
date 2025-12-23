import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shortenUrlSchema } from "@/lib/validators";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url } = shortenUrlSchema.parse(body);

        const existing = await db.shortUrl.findFirst({
            where: { originalUrl: url },
        });

        if (existing) {
            return NextResponse.json({
                slug: existing.slug,
                shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${existing.slug}`,
            });
        }

        const slug = nanoid(6);
        const shortUrl = await db.shortUrl.create({
            data: {
                slug,
                originalUrl: url,
            },
        });

        return NextResponse.json({
            slug: shortUrl.slug,
            shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortUrl.slug}`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.shortUrl.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 }
        );
    }
}
