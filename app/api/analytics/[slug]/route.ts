import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const shortUrl = await db.shortUrl.findUnique({
            where: { slug },
            include: {
                qrCodes: true,
            },
        });

        if (!shortUrl) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            slug: shortUrl.slug,
            originalUrl: shortUrl.originalUrl,
            clicks: shortUrl.clicks,
            createdAt: shortUrl.createdAt,
            qrCodesGenerated: shortUrl.qrCodes.length,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
