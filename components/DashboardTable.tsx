"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ExternalLink, QrCode as QrIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ShortUrl = {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: string; // Passed as string from server
};

type QrCode = {
  id: string;
  content: string;
  createdAt: string;
  size: number;
};

interface DashboardTableProps {
  urls: ShortUrl[];
  qrCodes: QrCode[];
}

export default function DashboardTable({ urls, qrCodes }: DashboardTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const deleteItem = async (id: string, type: "url" | "qr") => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeleting(id);
    try {
      // We need API endpoints for DELETE.
      // Assuming /api/shorten?id=... and /api/qrcode?id=... or similar
      // Or we can use a server action. 
      // For this implementation, I will assume we added DELETE method to the APIs.
      
       const endpoint = type === "url" ? "/api/shorten" : "/api/qrcode";
       const res = await fetch(endpoint, {
         method: "DELETE",
         body: JSON.stringify({ id }),
       });

       if (!res.ok) throw new Error("Failed to delete");
       
       toast.success("Item deleted");
       router.refresh();
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setDeleting(null);
    }
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <div className="space-y-6">
      <Tabs defaultValue="urls" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="urls">Short URLs</TabsTrigger>
          <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="urls" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Short URLs</CardTitle>
            </CardHeader>
            <CardContent>
              {urls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No URLs shortened yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5 data-[state=selected]:bg-muted">
                        <TableHead>Short Link</TableHead>
                        <TableHead className="max-w-[200px]">Original URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urls.map((url) => (
                        <TableRow key={url.id} className="hover:bg-white/5">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-500">/{url.slug}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(`${appUrl}/${url.slug}`)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[200px]" title={url.originalUrl}>
                            {url.originalUrl}
                          </TableCell>
                          <TableCell>{url.clicks}</TableCell>
                          <TableCell>
                            {new Date(url.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                             <a href={`/${url.slug}`} target="_blank" rel="noreferrer" className="inline-flex">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500">
                                   <ExternalLink className="h-4 w-4" />
                                </Button>
                             </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                              onClick={() => deleteItem(url.id, "url")}
                              disabled={deleting === url.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcodes" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
               <CardTitle>Recent QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {qrCodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No QR codes generated yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qrCodes.map((qr) => (
                        <TableRow key={qr.id} className="hover:bg-white/5">
                          <TableCell className="truncate max-w-[300px]" title={qr.content}>
                            {qr.content}
                          </TableCell>
                          <TableCell>{qr.size}px</TableCell>
                          <TableCell>
                            {new Date(qr.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                              onClick={() => deleteItem(qr.id, "qr")}
                              disabled={deleting === qr.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
