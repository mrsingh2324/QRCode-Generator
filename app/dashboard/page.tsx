import { db } from "@/lib/db";
import DashboardTable from "@/components/DashboardTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure real-time data

export default async function DashboardPage() {
  const shortUrls = await db.shortUrl.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const qrCodes = await db.qrCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Serialize dates for Client Component
  const formattedUrls = shortUrls.map((url: any) => ({
    ...url,
    createdAt: url.createdAt.toISOString(),
  }));

  const formattedQrCodes = qrCodes.map((qr: any) => ({
    ...qr,
    createdAt: qr.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                 <Link href="/">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                 </Link>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Dashboard
                </h1>
            </div>
            <Link href="/">
                <Button variant="outline" className="glass-card hover:bg-white/50">
                    Create New
                </Button>
            </Link>
        </header>

        <main>
          <DashboardTable urls={formattedUrls} qrCodes={formattedQrCodes} />
        </main>
      </div>
    </div>
  );
}
