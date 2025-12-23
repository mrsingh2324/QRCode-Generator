import { NextResponse } from "next/server";
import { qrCodeSchema } from "@/lib/validators";
import QRCode from "qrcode";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, size, fgColor, bgColor } = qrCodeSchema.parse(body);

        // Generate QR Code as Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(content, {
            width: size,
            margin: 1,
            color: {
                dark: fgColor,
                light: bgColor,
            },
        });

        // Optionally save to DB if you want to track history (as per requirements)
        // We only save if it's explicitly part of a tracking flow or we just log all generations
        // Requirements say "Recent QR code generation history", so we save it.

        await db.qrCode.create({
            data: {
                content,
                size,
                fgColor,
                bgColor,
            },
        });

        return NextResponse.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to generate QR code" },
            { status: 400 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.qrCode.delete({
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
